import { useState, useEffect } from 'react'

/**
 * Formulario de registro de entrada de inventario (HU03, RN-09, CA-HU03-01 a CA-HU03-08)
 */
export const EntradaInventarioForm = ({
  productos = [],
  onSubmit,
  submitting = false
}) => {
  const [idProducto, setIdProducto] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [referencia, setReferencia] = useState('')
  const [observacion, setObservacion] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const productoSeleccionado = productos.find(
    (p) => String(p.id_producto) === String(idProducto)
  )

  const stockAnterior = productoSeleccionado ? productoSeleccionado.stock_actual : 0
  const cantNum = parseInt(cantidad, 10) || 0
  const stockResultante = stockAnterior + cantNum

  useEffect(() => {
    setErrorMsg('')
  }, [idProducto, cantidad])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!idProducto) {
      setErrorMsg('Debe seleccionar un producto.')
      return
    }

    if (!cantNum || cantNum <= 0) {
      setErrorMsg('La cantidad a ingresar debe ser mayor a 0.')
      return
    }

    if (referencia.length > 80) {
      setErrorMsg('La referencia no puede superar 80 caracteres.')
      return
    }

    if (observacion.length > 200) {
      setErrorMsg('La observación no puede superar 200 caracteres.')
      return
    }

    onSubmit({
      id_producto: parseInt(idProducto, 10),
      cantidad: cantNum,
      referencia,
      observacion
    })

    // Limpiar campos tras enviar
    setCantidad('')
    setReferencia('')
    setObservacion('')
  }

  return (
    <form onSubmit={handleSubmit} className="inventario-form">
      {errorMsg && (
        <div className="alert alert-error mb-4">
          <span>✕</span> {errorMsg}
        </div>
      )}

      <div className="form-grid">
        {/* Selector de Producto */}
        <div className="form-group form-col-full">
          <label htmlFor="id_producto_inv">
            Producto a Ingresar <span className="text-danger">*</span>
          </label>
          <select
            id="id_producto_inv"
            className="form-control"
            value={idProducto}
            onChange={(e) => setIdProducto(e.target.value)}
            disabled={submitting}
          >
            <option value="">-- Seleccione un producto del catálogo --</option>
            {productos
              .filter((p) => p.estado)
              .map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  [{p.codigo}] {p.nombre} — Stock actual: {p.stock_actual} un.
                </option>
              ))}
          </select>
        </div>

        {/* Resumen de Stock Dinámico */}
        {productoSeleccionado && (
          <div className="stock-preview-card form-col-full">
            <div className="stock-stat">
              <span className="stat-label">Stock Anterior</span>
              <strong className="stat-value">{stockAnterior} un.</strong>
            </div>
            <div className="stock-operator">+</div>
            <div className="stock-stat">
              <span className="stat-label">Cantidad Entrada</span>
              <strong className="stat-value text-success">
                +{cantNum > 0 ? cantNum : 0} un.
              </strong>
            </div>
            <div className="stock-operator">=</div>
            <div className="stock-stat highlight">
              <span className="stat-label">Stock Resultante</span>
              <strong className="stat-value text-primary">
                {stockResultante} un.
              </strong>
            </div>
          </div>
        )}

        {/* Cantidad a Ingresar */}
        <div className="form-group">
          <label htmlFor="cantidad_inv">
            Cantidad de Ingreso <span className="text-danger">*</span>
          </label>
          <input
            id="cantidad_inv"
            type="number"
            min="1"
            className="form-control"
            placeholder="Ej. 12, 24"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            disabled={!idProducto || submitting}
          />
        </div>

        {/* Referencia */}
        <div className="form-group">
          <label htmlFor="referencia_inv">Referencia / Nro. Factura (Opcional)</label>
          <input
            id="referencia_inv"
            type="text"
            className="form-control"
            placeholder="Ej. FAC-1092 / Proveedor Licores Sur"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            disabled={!idProducto || submitting}
            maxLength={80}
          />
        </div>

        {/* Observación */}
        <div className="form-group form-col-full">
          <label htmlFor="observacion_inv">Observaciones (Opcional)</label>
          <textarea
            id="observacion_inv"
            rows="2"
            className="form-control"
            placeholder="Detalles sobre el lote, estado del empaque, etc."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            disabled={!idProducto || submitting}
            maxLength={200}
          ></textarea>
        </div>
      </div>

      <div className="form-actions mt-4">
        <button
          type="submit"
          className="btn btn-success btn-lg btn-block"
          disabled={!idProducto || cantNum <= 0 || submitting}
        >
          {submitting ? 'Procesando Entrada...' : '📥 Registrar Entrada de Inventario'}
        </button>
      </div>
    </form>
  )
}
