import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="brand-logo-small">🍷</div>
        <div className="navbar-title-container">
          <h1 className="navbar-title">Licorería "Al Paso"</h1>
          <span className="navbar-subtitle">Sistema de Gestión</span>
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="user-profile">
            <div className="user-avatar">
              {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.nombre}</span>
              <span className="user-role-badge">{user.rol || 'Usuario'}</span>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm logout-btn"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <span>🚪 Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
