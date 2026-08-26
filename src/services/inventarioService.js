import { supabase } from './supabase'

/**
 * Servicio para gestión de inventario y movimientos (HU03)
 * Conforme al modelo de datos: movimiento_inventario (id_movimiento, tipo, cantidad, stock_anterior, stock_resultante, fecha_hora, referencia, observacion, id_producto, id_usuario)
 */
export const inventarioService = {
  /**
   * Consulta el stock actual y detalles básicos de un producto
   * @param {number} id_producto
   */
  async consultarStock(id_producto) {
    try {
      const { data, error } = await supabase
        .from('producto')
        .select('id_producto, codigo, nombre, stock_actual, stock_minimo, estado')
        .eq('id_producto', id_producto)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('[inventarioService.consultarStock] Error:', err)
      return { success: false, data: null, message: 'No se pudo obtener el stock del producto.' }
    }
  },

  /**
   * Registra una entrada de inventario (HU03, RN-09, CA-HU03-01 a CA-HU03-08)
   * @param {object} params
   * @param {number} params.id_producto - ID del producto
   * @param {number} params.cantidad - Cantidad que ingresa (> 0)
   * @param {number} params.id_usuario - ID del usuario responsable
   * @param {string} [params.referencia] - Referencia o factura/nota (opcional, máx 80 caracteres)
   * @param {string} [params.observacion] - Observaciones (opcional, máx 200 caracteres)
   */
  async registrarEntrada({ id_producto, cantidad, id_usuario, referencia = '', observacion = '' }) {
    try {
      const cant = parseInt(cantidad, 10)
      if (isNaN(cant) || cant <= 0) {
        return { success: false, message: 'La cantidad a ingresar debe ser mayor que cero.' }
      }
      if (!id_producto) {
        return { success: false, message: 'Debe seleccionar un producto válido.' }
      }
      if (!id_usuario) {
        return { success: false, message: 'No se pudo identificar al usuario responsable.' }
      }

      // 1. Obtener producto y su stock actual
      const { data: prod, error: errProd } = await supabase
        .from('producto')
        .select('id_producto, stock_actual, nombre')
        .eq('id_producto', id_producto)
        .single()

      if (errProd || !prod) {
        return { success: false, message: 'El producto seleccionado no existe.' }
      }

      const stockAnterior = prod.stock_actual
      const stockResultante = stockAnterior + cant

      // 2. Actualizar stock del producto
      const { error: errUpdate } = await supabase
        .from('producto')
        .update({ stock_actual: stockResultante })
        .eq('id_producto', id_producto)

      if (errUpdate) throw errUpdate

      // 3. Registrar el movimiento de inventario (tipo 'ENTRADA')
      const movimientoData = {
        tipo: 'ENTRADA',
        cantidad: cant,
        stock_anterior: stockAnterior,
        stock_resultante: stockResultante,
        fecha_hora: new Date().toISOString(),
        referencia: referencia?.trim() || null,
        observacion: observacion?.trim() || null,
        id_producto: id_producto,
        id_usuario: id_usuario
      }

      const { data: movGuardado, error: errMov } = await supabase
        .from('movimiento_inventario')
        .insert([movimientoData])
        .select()
        .single()

      if (errMov) {
        // En caso de fallo al insertar movimiento, revertimos stock para mantener consistencia (CA-HU03-08)
        await supabase
          .from('producto')
          .update({ stock_actual: stockAnterior })
          .eq('id_producto', id_producto)

        throw errMov
      }

      return {
        success: true,
        data: movGuardado,
        stockAnterior,
        stockResultante,
        message: `Entrada registrada con éxito. Nuevo stock de ${prod.nombre}: ${stockResultante} unidades.`
      }
    } catch (err) {
      console.error('[inventarioService.registrarEntrada] Error:', err)
      return { success: false, message: err.message || 'Error al registrar la entrada de inventario.' }
    }
  },

  /**
   * Obtiene el historial de movimientos de inventario
   * @param {number} [id_producto] - Filtro opcional por producto
   */
  async getMovimientos(id_producto = null) {
    try {
      let query = supabase
        .from('movimiento_inventario')
        .select(`
          id_movimiento,
          tipo,
          cantidad,
          stock_anterior,
          stock_resultante,
          fecha_hora,
          referencia,
          observacion,
          producto:id_producto (
            id_producto,
            codigo,
            nombre
          ),
          usuario:id_usuario (
            id_usuario,
            nombre,
            usuario
          )
        `)
        .order('fecha_hora', { ascending: false })

      if (id_producto) {
        query = query.eq('id_producto', id_producto)
      }

      const { data, error } = await query
      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('[inventarioService.getMovimientos] Error:', err)
      return { success: false, data: [], message: 'Error al obtener historial de movimientos.' }
    }
  }
}
