import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Alert } from '../../components/Alert'

/**
 * Formulario de inicio de sesión (HU01, RN-01)
 */
export const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!username.trim()) {
      setErrorMsg('Por favor, ingresa tu nombre de usuario.')
      return
    }

    if (!password) {
      setErrorMsg('Por favor, ingresa tu contraseña.')
      return
    }

    setSubmitting(true)
    try {
      const res = await login(username, password)
      if (res.success) {
        navigate(from, { replace: true })
      } else {
        setErrorMsg(res.message || 'Error al iniciar sesión.')
      }
    } catch (err) {
      console.error('[LoginForm] Error:', err)
      setErrorMsg('Ocurrió un error de conexión con el servidor.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-card">
      <div className="login-header">
        <div className="login-icon">🍷</div>
        <h2 className="login-title">Licorería "Al Paso"</h2>
        <p className="login-subtitle">Sistema de Control y Gestión</p>
      </div>

      {errorMsg && (
        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <div className="input-with-icon">
            <span className="input-icon">👤</span>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Ej. admin, vendedor"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              autoComplete="username"
              autoFocus
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="input-with-icon">
            <span className="input-icon">🔒</span>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={submitting}
        >
          {submitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="login-footer">
        <small className="text-muted">
          Sprint 1 — Acceso exclusivo a personal autorizado
        </small>
      </div>
    </div>
  )
}
