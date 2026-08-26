import { supabase } from './supabase'

/**
 * Servicio para registro y consulta de ventas (HU04)
 * Conforme al modelo de datos:
 * - venta (id_venta, fecha_hora, total, id_usuario)
 * - detalle_venta (id_detalle, cantidad, precio_unitario, subtotal, id_venta, id_producto)
 * - movimiento_inventario (tipo = 'SALIDA')
 */
export const ventaService = {
  /**
   * Registra una venta completa con sus detalles, descuento de stock y movimientos de salida
   * @param {object} params
   * @param {number} params.id_usuario - ID del usuario vendedor
   * @param {Array<{ id_producto: number, cantidad: number, precio_unitario: number, nombre: string }>} params.detalles - Lista de productos en el carrito
   * @param {boolean} params.verificoEdad - Confirmación de verificación de mayoría de edad (Ley 259 / RL-01, RL-02)
   */
  async registrarVenta({ id_usuario, detalles, verificoEdad = false }) {
    if (!id_usuario) {
      return { success: false, message: 'Usuario no identificado.' }
    }

    if (!verificoEdad) {
      return {
        success: false,
        message: 'Debe confirmar que se verificó la mayoría de edad del comprador conforme a la Ley N.º 259.'
      }
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return { success: false, message: 'La venta debe contener al menos un producto.' }
    }

    try {
      // 1. Validar disponibilidad de stock para cada producto en tiempo real
      const productIds = detalles.map((d) => d.id_producto)
      const { data: productosDb, error: errProd } = await supabase
        .from('producto')
        .select('id_producto, nombre, precio_venta, stock_actual, estado')
        .in('id_producto', productIds)

      if (errProd || !productosDb) {
        return { success: false, message: 'Error al verificar disponibilidad de productos.' }
      }

      const prodMap = new Map(productosDb.map((p) => [p.id_producto, p]))

      let totalCalculado = 0
      const detallesValidados = []

      for (const item of detalles) {
        const prod = prodMap.get(item.id_producto)
        if (!prod) {
          return { success: false, message: `El producto ID ${item.id_producto} no existe.` }
        }
        if (!prod.estado) {
          return { success: false, message: `El producto "${prod.nombre}" se encuentra inactivo.` }
        }

        const cant = parseInt(item.cantidad, 10)
        if (isNaN(cant) || cant <= 0) {
          return { success: false, message: `Cantidad inválida para "${prod.nombre}".` }
        }

        if (cant > prod.stock_actual) {
          return {
            success: false,
            message: `Stock insuficiente para "${prod.nombre}". Stock disponible: ${prod.stock_actual}, solicitado: ${cant}.`
          }
        }

        const precioUnitario = parseFloat(item.precio_unitario || prod.precio_venta)
        const subtotal = Math.round(cant * precioUnitario * 100) / 100
        totalCalculado += subtotal

        detallesValidados.push({
          id_producto: prod.id_producto,
          nombre: prod.nombre,
          cantidad: cant,
          precio_unitario: precioUnitario,
          subtotal: subtotal,
          stock_anterior: prod.stock_actual,
          stock_resultante: prod.stock_actual - cant
        })
      }

      totalCalculado = Math.round(totalCalculado * 100) / 100

      // 2. Insertar cabecera de venta
      const { data: ventaGuardada, error: errVenta } = await supabase
        .from('venta')
        .insert([
          {
            fecha_hora: new Date().toISOString(),
            total: totalCalculado,
            id_usuario: id_usuario
          }
        ])
        .select()
        .single()

      if (errVenta || !ventaGuardada) {
        throw new Error('Error al registrar la venta: ' + (errVenta?.message || ''))
      }

      const id_venta = ventaGuardada.id_venta

      // 3. Insertar registros en detalle_venta
      const detallesInsert = detallesValidados.map((d) => ({
        id_venta: id_venta,
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.subtotal
      }))

      const { error: errDetalles } = await supabase
        .from('detalle_venta')
        .insert(detallesInsert)

      if (errDetalles) {
        // Revertir venta creada en caso de error
        await supabase.from('venta').delete().eq('id_venta', id_venta)
        throw new Error('Error al registrar el detalle de la venta.')
      }

      // 4. Actualizar stock y generar movimientos de inventario de tipo 'SALIDA'
      for (const d of detallesValidados) {
        // Descontar stock
        const { error: errStock } = await supabase
          .from('producto')
          .update({ stock_actual: d.stock_resultante })
          .eq('id_producto', d.id_producto)

        if (errStock) {
          console.error(`[ventaService] Error descontando stock de prod ${d.id_producto}:`, errStock)
        }

        // Registrar movimiento 'SALIDA'
        const { error: errMov } = await supabase
          .from('movimiento_inventario')
          .insert([
            {
              tipo: 'SALIDA',
              cantidad: d.cantidad,
              stock_anterior: d.stock_anterior,
              stock_resultante: d.stock_resultante,
              fecha_hora: new Date().toISOString(),
              referencia: `Venta #${id_venta}`,
              observacion: `Salida automática por venta #${id_venta}`,
              id_producto: d.id_producto,
              id_usuario: id_usuario
            }
          ])

        if (errMov) {
          console.error(`[ventaService] Error al registrar movimiento de salida para prod ${d.id_producto}:`, errMov)
        }
      }

      return {
        success: true,
        data: {
          id_venta: id_venta,
          total: totalCalculado,
          itemsCount: detallesValidados.length
        },
        message: `Venta #${id_venta} registrada exitosamente por Bs. ${totalCalculado.toFixed(2)}.`
      }
    } catch (err) {
      console.error('[ventaService.registrarVenta] Error:', err)
      return { success: false, message: err.message || 'Ocurrió un error al procesar la venta.' }
    }
  },

  /**
   * Obtiene la lista de ventas realizadas con usuario y detalles
   */
  async getVentas({ limit = 20 } = {}) {
    try {
      const { data, error } = await supabase
        .from('venta')
        .select(`
          id_venta,
          fecha_hora,
          total,
          usuario:id_usuario (
            id_usuario,
            nombre,
            usuario
          ),
          detalle_venta (
            id_detalle,
            cantidad,
            precio_unitario,
            subtotal,
            producto:id_producto (
              id_producto,
              codigo,
              nombre
            )
          )
        `)
        .order('fecha_hora', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('[ventaService.getVentas] Error:', err)
      return { success: false, data: [], message: 'Error al obtener historial de ventas.' }
    }
  }
}
