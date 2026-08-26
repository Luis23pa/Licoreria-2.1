import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-background-pattern"></div>
      <div className="auth-card-container animate-fade-in">
        <Outlet />
      </div>
    </div>
  )
}
