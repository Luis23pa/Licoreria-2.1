/**
 * Tabla de detalle de venta en el POS (HU04)
 */
export const DetalleVentaTable = ({
  detalles = [],
  onActualizarCantidad,
  onEliminarItem
}) => {
  if (detalles.length === 0) {
    return (
      <div className="cart-empty text-center p-6">
        <span className="empty-cart-icon">🛒</span>
        <p className="text-muted mt-2">El carrito de venta está vacío.</p>
        <small className="text-muted">
          Busque y agregue productos desde el panel lateral.
        </small>
      </div>
    )
  }

  const totalVenta = detalles.reduce((acc, item) => acc + item.subtotal, 0)

  return (
    <div className="cart-table-wrapper">
      <table className="data-table data-table-sm cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="text-right">Precio Unit.</th>
            <th className="text-center" style={{ width: '130px' }}>
              Cantidad
            </th>
            <th className="text-right">Subtotal</th>
            <th className="text-center" style={{ width: '50px' }}>
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((item) => (
            <tr key={item.id_producto}>
              <td>
                <strong>{item.nombre}</strong>
                <div className="text-muted text-xs">
                  Stock disp.: {item.stock_disponible} un.
                </div>
              </td>
              <td className="text-right">
                Bs. {parseFloat(item.precio_unitario).toFixed(2)}
              </td>
              <td className="text-center">
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      onActualizarCantidad(item.id_producto, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.stock_disponible}
                    className="qty-input form-control form-control-sm text-center"
                    value={item.cantidad}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val)) {
                        onActualizarCantidad(item.id_producto, val)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() =>
                      onActualizarCantidad(item.id_producto, item.cantidad + 1)
                    }
                    disabled={item.cantidad >= item.stock_disponible}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="text-right font-bold">
                Bs. {item.subtotal.toFixed(2)}
              </td>
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger btn-icon-only"
                  onClick={() => onEliminarItem(item.id_producto)}
                  title="Quitar producto"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Resumen del Total */}
      <div className="cart-summary-box">
        <div className="summary-row">
          <span>Total Ítems:</span>
          <strong>{detalles.reduce((sum, d) => sum + d.cantidad, 0)} unidades</strong>
        </div>
        <div className="summary-row total-row">
          <span>Total a Cobrar:</span>
          <span className="total-amount">Bs. {totalVenta.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
