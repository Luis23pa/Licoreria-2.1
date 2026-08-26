/**
 * Tabla de catálogo de productos (HU02)
 */
export const ProductoTable = ({
  productos = [],
  loading = false,
  onEditar,
  onDesactivar,
  onReactivar
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Cargando catálogo de productos...</p>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="table-empty">
        <span className="empty-icon">🍾</span>
        <h4>No se encontraron productos</h4>
        <p>No hay productos que coincidan con los criterios de búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th className="text-right">Precio Venta</th>
            <th className="text-center">Stock Actual</th>
            <th className="text-center">Stock Mínimo</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => {
            const esStockBajo = prod.stock_actual <= prod.stock_minimo && prod.estado
            return (
              <tr key={prod.id_producto} className={!prod.estado ? 'row-inactive' : ''}>
                <td className="font-mono font-bold">{prod.codigo}</td>
                <td>
                  <strong>{prod.nombre}</strong>
                </td>
                <td>
                  <span className="tag-category">
                    {prod.categoria?.nombre || 'General'}
                  </span>
                </td>
                <td>{prod.marca || '-'}</td>
                <td className="text-right font-bold">
                  Bs. {parseFloat(prod.precio_venta).toFixed(2)}
                </td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      esStockBajo
                        ? 'badge-warning'
                        : prod.stock_actual === 0
                        ? 'badge-danger'
                        : 'badge-success'
                    }`}
                  >
                    {prod.stock_actual} un.
                  </span>
                </td>
                <td className="text-center text-muted">{prod.stock_minimo} un.</td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      prod.estado ? 'badge-active' : 'badge-inactive'
                    }`}
                  >
                    {prod.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="text-center table-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEditar(prod)}
                    title="Editar producto"
                  >
                    ✏️ Editar
                  </button>
                  {prod.estado ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDesactivar(prod)}
                      title="Desactivar producto"
                    >
                      🚫 Desactivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      onClick={() => onReactivar(prod)}
                      title="Reactivar producto"
                    >
                      ✅ Reactivar
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
