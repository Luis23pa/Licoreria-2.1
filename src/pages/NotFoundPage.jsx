import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="not-found-container card p-8 text-center animate-fade-in">
      <div className="not-found-icon">🍾 404</div>
      <h2 className="text-2xl font-bold mt-4 mb-2">Página no encontrada</h2>
      <p className="text-muted mb-6">
        La página o módulo que estás buscando no existe en el sistema.
      </p>
      <Link to="/" className="btn btn-primary">
        🏠 Volver al Dashboard
      </Link>
    </div>
  )
}
