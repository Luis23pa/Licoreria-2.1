import { NavLink } from 'react-router-dom'

export const Sidebar = () => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: '📊',
      desc: 'Panel principal'
    },
    {
      to: '/productos',
      label: 'Productos',
      icon: '🍾',
      desc: 'Catálogo de licores'
    },
    {
      to: '/inventario',
      label: 'Inventario',
      icon: '📦',
      desc: 'Entrada de stock'
    },
    {
      to: '/ventas',
      label: 'Punto de Venta',
      icon: '💰',
      desc: 'Registro de ventas'
    }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">🍾</span>
        <div className="sidebar-brand-text">
          <strong>Al Paso</strong>
          <small>Sprint 1 MVP</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {navItems.map((item) => (
            <li key={item.to} className="sidebar-item">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <div className="sidebar-link-text">
                  <span className="sidebar-link-title">{item.label}</span>
                  <span className="sidebar-link-desc">{item.desc}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="system-version">
          <small>Licorería Al Paso v1.0</small>
          <span className="badge badge-success">Online</span>
        </div>
      </div>
    </aside>
  )
}
