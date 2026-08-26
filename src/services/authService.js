import { supabase } from './supabase'

/**
 * Servicio de autenticación para HU01
 * Conforme al modelo de datos: usuario (id_usuario, nombre, usuario, password_hash, estado, id_rol)
 * y rol (id_rol, nombre)
 */
export const authService = {
  /**
   * Busca y valida un usuario por credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña ingresada
   * @returns {Promise<{ success: boolean, user?: object, message?: string }>}
   */
  async login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Usuario y contraseña son obligatorios.' }
    }

    try {
      const { data: user, error } = await supabase
        .from('usuario')
        .select(`
          id_usuario,
          nombre,
          usuario,
          password_hash,
          estado,
          id_rol,
          rol:id_rol (
            id_rol,
            nombre
          )
        `)
        .eq('usuario', username.trim())
        .single()

      if (error || !user) {
        return { success: false, message: 'Credenciales incorrectas.' }
      }

      // Validar estado del usuario (RN-01 / CA-HU01-03)
      if (!user.estado) {
        return {
          success: false,
          message: 'El usuario se encuentra inactivo. Contacte al administrador.'
        }
      }

      // Validación de contraseña (en frontend/MVP comparamos con hash o texto seguro según configuración)
      // Nota: En producción las contraseñas se validan con algoritmo criptográfico o Supabase Auth
      if (user.password_hash !== password && user.password_hash !== btoa(password)) {
        return { success: false, message: 'Credenciales incorrectas.' }
      }

      const userData = {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        usuario: user.usuario,
        id_rol: user.id_rol,
        rol: user.rol?.nombre || 'Usuario',
        estado: user.estado
      }

      return { success: true, user: userData }
    } catch (err) {
      console.error('[authService.login] Error inesperado:', err)
      return {
        success: false,
        message: 'Ocurrió un error al procesar el inicio de sesión.'
      }
    }
  },

  /**
   * Obtiene los roles registrados en el sistema
   */
  async getRoles() {
    const { data, error } = await supabase.from('rol').select('*').order('id_rol')
    if (error) {
      console.error('[authService.getRoles] Error:', error)
      return []
    }
    return data
  }
}
