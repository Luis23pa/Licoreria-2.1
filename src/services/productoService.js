import { supabase } from './supabase'

/**
 * Servicio para gestión de productos (HU02)
 * Conforme al modelo de datos: producto (id_producto, codigo, nombre, marca, precio_venta, stock_actual, stock_minimo, estado, id_categoria)
 * y categoria (id_categoria, nombre)
 */
export const productoService = {
  /**
   * Obtiene la lista de categorías
   */
  async getCategorias() {
    try {
      const { data, error } = await supabase
        .from('categoria')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('[productoService.getCategorias] Error:', err)
      return { success: false, data: [], message: 'Error al obtener categorías.' }
    }
  },

  /**
   * Obtiene la lista de productos con datos de categoría
   * @param {object} options
   * @param {string} [options.busqueda] - Término de búsqueda por código o nombre
   * @param {boolean} [options.soloActivos] - Si es true, filtra solo estado = true
   * @param {number} [options.id_categoria] - Filtro por categoría específica
   */
  async getProductos({ busqueda = '', soloActivos = false, id_categoria = null } = {}) {
    try {
      let query = supabase
        .from('producto')
        .select(`
          id_producto,
          codigo,
          nombre,
          marca,
          precio_venta,
          stock_actual,
          stock_minimo,
          estado,
          id_categoria,
          categoria:id_categoria (
            id_categoria,
            nombre
          )
        `)
        .order('nombre', { ascending: true })

      if (soloActivos) {
        query = query.eq('estado', true)
      }

      if (id_categoria) {
        query = query.eq('id_categoria', id_categoria)
      }

      if (busqueda.trim()) {
        const term = `%${busqueda.trim()}%`
        query = query.or(`codigo.ilike.${term},nombre.ilike.${term},marca.ilike.${term}`)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('[productoService.getProductos] Error:', err)
      return { success: false, data: [], message: 'Error al obtener productos.' }
    }
  },

  /**
   * Obtiene un producto por su ID
   */
  async getProductoById(id_producto) {
    try {
      const { data, error } = await supabase
        .from('producto')
        .select(`
          *,
          categoria:id_categoria (
            id_categoria,
            nombre
          )
        `)
        .eq('id_producto', id_producto)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('[productoService.getProductoById] Error:', err)
      return { success: false, data: null, message: 'Producto no encontrado.' }
    }
  },

  /**
   * Registra un nuevo producto (HU02)
   */
  async crearProducto(productoData) {
    try {
      // Validaciones del PRD (RN-05, RN-06, RN-07)
      if (!productoData.codigo?.trim()) {
        return { success: false, message: 'El código del producto es obligatorio.' }
      }
      if (!productoData.nombre?.trim()) {
        return { success: false, message: 'El nombre del producto es obligatorio.' }
      }
      if (!productoData.id_categoria) {
        return { success: false, message: 'Debe seleccionar una categoría válida.' }
      }
      if (Number(productoData.precio_venta) <= 0) {
        return { success: false, message: 'El precio de venta debe ser mayor a 0.' }
      }
      if (Number(productoData.stock_actual) < 0 || Number(productoData.stock_minimo) < 0) {
        return { success: false, message: 'Los valores de stock no pueden ser negativos.' }
      }

      // Validar código único
      const { data: existente } = await supabase
        .from('producto')
        .select('id_producto')
        .eq('codigo', productoData.codigo.trim())
        .maybeSingle()

      if (existente) {
        return { success: false, message: `El código "${productoData.codigo}" ya está registrado.` }
      }

      const nuevoRegistro = {
        codigo: productoData.codigo.trim().toUpperCase(),
        nombre: productoData.nombre.trim(),
        marca: productoData.marca?.trim() || null,
        precio_venta: parseFloat(productoData.precio_venta),
        stock_actual: parseInt(productoData.stock_actual || 0, 10),
        stock_minimo: parseInt(productoData.stock_minimo || 0, 10),
        estado: productoData.estado ?? true,
        id_categoria: parseInt(productoData.id_categoria, 10)
      }

      const { data, error } = await supabase
        .from('producto')
        .insert([nuevoRegistro])
        .select()
        .single()

      if (error) throw error
      return { success: true, data, message: 'Producto registrado exitosamente.' }
    } catch (err) {
      console.error('[productoService.crearProducto] Error:', err)
      return { success: false, message: err.message || 'Error al crear producto.' }
    }
  },

  /**
   * Actualiza un producto existente (HU02)
   */
  async actualizarProducto(id_producto, productoData) {
    try {
      if (Number(productoData.precio_venta) <= 0) {
        return { success: false, message: 'El precio de venta debe ser mayor a 0.' }
      }
      if (Number(productoData.stock_actual) < 0 || Number(productoData.stock_minimo) < 0) {
        return { success: false, message: 'Los valores de stock no pueden ser negativos.' }
      }

      // Validar código único excluyendo el actual
      if (productoData.codigo) {
        const { data: existente } = await supabase
          .from('producto')
          .select('id_producto')
          .eq('codigo', productoData.codigo.trim().toUpperCase())
          .neq('id_producto', id_producto)
          .maybeSingle()

        if (existente) {
          return { success: false, message: `El código "${productoData.codigo}" ya pertenece a otro producto.` }
        }
      }

      const datosActualizados = {
        ...(productoData.codigo && { codigo: productoData.codigo.trim().toUpperCase() }),
        ...(productoData.nombre && { nombre: productoData.nombre.trim() }),
        marca: productoData.marca?.trim() || null,
        precio_venta: parseFloat(productoData.precio_venta),
        stock_minimo: parseInt(productoData.stock_minimo, 10),
        ...(productoData.id_categoria && { id_categoria: parseInt(productoData.id_categoria, 10) }),
        ...(productoData.estado !== undefined && { estado: productoData.estado })
      }

      const { data, error } = await supabase
        .from('producto')
        .update(datosActualizados)
        .eq('id_producto', id_producto)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, message: 'Producto actualizado correctamente.' }
    } catch (err) {
      console.error('[productoService.actualizarProducto] Error:', err)
      return { success: false, message: err.message || 'Error al actualizar producto.' }
    }
  },

  /**
   * Desactivación lógica de un producto (RN-08, CA-HU02-10)
   */
  async desactivarProducto(id_producto) {
    try {
      const { data, error } = await supabase
        .from('producto')
        .update({ estado: false })
        .eq('id_producto', id_producto)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, message: 'Producto desactivado correctamente.' }
    } catch (err) {
      console.error('[productoService.desactivarProducto] Error:', err)
      return { success: false, message: 'Error al desactivar producto.' }
    }
  },

  /**
   * Reactivación de un producto previamente desactivado
   */
  async reactivarProducto(id_producto) {
    try {
      const { data, error } = await supabase
        .from('producto')
        .update({ estado: true })
        .eq('id_producto', id_producto)
        .select()
        .single()

      if (error) throw error
      return { success: true, data, message: 'Producto reactivado correctamente.' }
    } catch (err) {
      console.error('[productoService.reactivarProducto] Error:', err)
      return { success: false, message: 'Error al reactivar producto.' }
    }
  }
}
