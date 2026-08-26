import { useState } from 'react'
import { DetalleVentaTable } from './DetalleVentaTable'
import { ConfirmarEdadModal } from './ConfirmarEdadModal'

/**
 * Componente principal del Punto de Venta (HU04)
 */
export const VentaPOS = ({
  productos = [],
  onFinalizarVenta,
  submitting = false
}) => {
  const [busqueda, setBusqueda] = useState('')
  const [detalles, setDetalles] = useState([])
  const [showAgeModal, setShowAgeModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Filtrar productos con existencias para venta rápida
  const productosFiltrados = productos.filter((p) => {
    if (!p.estado || p.stock_actual <= 0) return false
    if (!busqueda.trim()) return true
    const term = busqueda.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(term) ||
      p.codigo.toLowerCase().includes(term) ||
      (p.marca && p.marca.toLowerCase().includes(term))
    )
  })

  const handleAgregarProducto = (producto) => {
    setErrorMsg('')
    const existe = detalles.find((d) => d.id_producto === producto.id_producto)

    if (existe) {
      if (existe.cantidad + 1 > producto.stock_actual) {
        setErrorMsg(
          `No se puede agregar más unidades de "${producto.nombre}". Stock disponible: ${producto.stock_actual}.`
        )
        return
      }
      setDetalles(
        detalles.map((d) =>
          d.id_producto === producto.id_producto
            ? {
                ...d,
                cantidad: d.cantidad + 1,
                subtotal: (d.cantidad + 1) * d.precio_unitario
              }
            : d
        )
      )
    } else {
      setDetalles([
        ...detalles,
        {
          id_producto: producto.id_producto,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio_unitario: parseFloat(producto.precio_venta),
          cantidad: 1,
          subtotal: parseFloat(producto.precio_venta),
          stock_disponible: producto.stock_actual
        }
      ])
    }
  }

  const handleActualizarCantidad = (id_producto, nuevaCantidad) => {
    setErrorMsg('')
    const item = detalles.find((d) => d.id_producto === id_producto)
    if (!item) return

    if (nuevaCantidad > item.stock_disponible) {
      setErrorMsg(
        `Cantidad excede el stock disponible (${item.stock_disponible} un.) para "${item.nombre}".`
      )
      return
    }

    if (nuevaCantidad <= 0) {
      handleEliminarItem(id_producto)
      return
    }

    setDetalles(
      detalles.map((d) =>
        d.id_producto === id_producto
          ? {
              ...d,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * d.precio_unitario
            }
          : d
      )
    )
  }

  const handleEliminarItem = (id_producto) => {
    setDetalles(detalles.filter((d) => d.id_producto !== id_producto))
  }

  const handleVaciarCarrito = () => {
    if (detalles.length > 0 && window.confirm('¿Desea vaciar el carrito actual?')) {
      setDetalles([])
    }
  }

  const totalVenta = detalles.reduce((acc, item) => acc + item.subtotal, 0)
  const totalItems = detalles.reduce((acc, item) => acc + item.cantidad, 0)

  const handleIniciarCobro = () => {
    if (detalles.length === 0) {
      setErrorMsg('Debe agregar al menos un producto a la venta.')
      return
    }
    setShowAgeModal(true)
  }

  const handleConfirmarVenta = async () => {
    setShowAgeModal(false)
    const res = await onFinalizarVenta({
      detalles,
      verificoEdad: true
    })
    if (res?.success) {
      setDetalles([])
    }
  }

  return (
    <div className="pos-layout">
      {errorMsg && (
        <div className="alert alert-warning mb-3">
          <span>⚠</span> {errorMsg}
        </div>
      )}

      <div className="pos-grid">
        {/* Panel Izquierdo: Catálogo de Productos con Stock */}
        <div className="pos-catalog card">
          <div className="pos-catalog-header">
            <h3 className="card-title">🍾 Seleccionar Licores / Bebidas</h3>
            <div className="pos-search-input">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por código, nombre o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="pos-products-grid">
            {productosFiltrados.length === 0 ? (
              <div className="text-center p-6 text-muted form-col-full">
                No hay productos disponibles para venta con los criterios indicados.
              </div>
            ) : (
              productosFiltrados.map((prod) => (
                <div
                  key={prod.id_producto}
                  className="product-card"
                  onClick={() => handleAgregarProducto(prod)}
                >
                  <div className="product-card-body">
                    <span className="product-code">{prod.codigo}</span>
                    <h4 className="product-name">{prod.nombre}</h4>
                    <span className="product-category">
                      {prod.categoria?.nombre || 'Bebida'}
                    </span>
                    <div className="product-footer">
                      <span className="product-price">
                        Bs. {parseFloat(prod.precio_venta).toFixed(2)}
                      </span>
                      <span className="product-stock-badge">
                        Disp: {prod.stock_actual}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel Derecho: Carrito de Venta Actual */}
        <div className="pos-cart card">
          <div className="card-header flex-between">
            <h3 className="card-title">🧾 Detalle de Venta</h3>
            {detalles.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={handleVaciarCarrito}
              >
                Vaciar
              </button>
            )}
          </div>

          <DetalleVentaTable
            detalles={detalles}
            onActualizarCantidad={handleActualizarCantidad}
            onEliminarItem={handleEliminarItem}
          />

          <div className="pos-actions mt-4">
            <button
              type="button"
              className="btn btn-success btn-lg btn-block"
              onClick={handleIniciarCobro}
              disabled={detalles.length === 0 || submitting}
            >
              {submitting
                ? 'Procesando Venta...'
                : `💵 Registrar Venta (Bs. ${totalVenta.toFixed(2)})`}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Ley 259 */}
      <ConfirmarEdadModal
        isOpen={showAgeModal}
        total={totalVenta}
        itemsCount={totalItems}
        onConfirm={handleConfirmarVenta}
        onCancel={() => setShowAgeModal(false)}
        submitting={submitting}
      />
    </div>
  )
}
