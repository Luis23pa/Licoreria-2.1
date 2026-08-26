/**
 * Componente Alert reutilizable para mensajes del sistema
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {string} message
 * @param {Function} [onClose]
 */
export const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`alert alert-${type} animate-fade-in`}>
      <span className="alert-icon">{icons[type]}</span>
      <div className="alert-message">{message}</div>
      {onClose && (
        <button
          type="button"
          className="alert-close-btn"
          onClick={onClose}
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  )
}
