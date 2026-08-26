import { useState } from 'react'
import { Modal } from '../../components/Modal'

/**
 * Modal de verificación legal de mayoría de edad — Ley N.º 259 (RL-01, RL-02, RN-17)
 */
export const ConfirmarEdadModal = ({
  isOpen,
  total,
  itemsCount,
  onConfirm,
  onCancel,
  submitting = false
}) => {
  const [verificado, setVerificado] = useState(false)

  const handleConfirm = () => {
    if (verificado) {
      onConfirm()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Verificación Legal de Venta (Ley N.º 259)"
      maxWidth="500px"
    >
      <div className="legal-verification-modal">
        <div className="legal-banner mb-4">
          <span className="legal-icon">🔞</span>
          <div>
            <h4 className="font-bold text-danger mb-1">
              Control de Expendio de Bebidas Alcohólicas
            </h4>
            <p className="text-sm text-muted">
              En cumplimiento estricto de la <strong>Ley N.º 259 de Bolivia</strong>,
              queda terminantemente prohibida la venta de bebidas alcohólicas a
              personas menores de 18 años.
            </p>
          </div>
        </div>

        <div className="sale-summary-preview p-3 mb-4">
          <div className="flex-between">
            <span>Total de productos:</span>
            <strong>{itemsCount} unidades</strong>
          </div>
          <div className="flex-between text-lg font-bold mt-2">
            <span>Monto Total:</span>
            <span className="text-primary">Bs. {parseFloat(total).toFixed(2)}</span>
          </div>
        </div>

        <label className="legal-checkbox-container checkbox-container mb-4">
          <input
            type="checkbox"
            checked={verificado}
            onChange={(e) => setVerificado(e.target.checked)}
            disabled={submitting}
          />
          <span className="font-bold">
            Como vendedor, confirmo haber verificado que el cliente es mayor de 18 años.
          </span>
        </label>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleConfirm}
            disabled={!verificado || submitting}
          >
            {submitting ? 'Registrando Venta...' : '✅ Confirmar y Finalizar Venta'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
