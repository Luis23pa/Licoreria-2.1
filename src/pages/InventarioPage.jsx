import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { productoService } from '../services/productoService'
import { inventarioService } from '../services/inventarioService'
import { EntradaInventarioForm } from '../modules/inventario/EntradaInventarioForm'
import { Alert } from '../components/Alert'

export const InventarioPage = () => {
  const { user } = useAuth()
  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alerta, setAlerta] = useState(null)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [resProd, resMov] = await Promise.all([
        productoService.getProductos({ soloActivos: true }),
        inventarioService.getMovimientos()
      ])

      if (resProd.success) setProductos(resProd.data)
      if (resMov.success) setMovimientos(resMov.data)
    } catch (err) {
      console.error('[InventarioPage] Error cargando datos:', err)
      setAlerta({
        type: 'error',
        message: 'Error al cargar los datos del inventario.'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const handleRegistrarEntrada = async (formData) => {
    setSubmitting(true)
    setAlerta(null)
    try {
      const res = await inventarioService.registrarEntrada({
        ...formData,
        id_usuario: user.id_usuario
      })

      if (res.success) {
        setAlerta({ type: 'success', message: res.message })
        cargarDatos()
      } else {
        setAlerta({ type: 'error', message: res.message })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Entradas de Inventario (HU03)</h2>
          <p className="page-description">
            Registro de ingresos de mercadería, cálculo automático de existencias y trazabilidad.
          </p>
        </div>
      </div>

      {alerta && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      <div className="two-column-grid">
        {/* Columna Izquierda: Formulario de Entrada */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📦 Registrar Nueva Entrada</h3>
          </div>
          <EntradaInventarioForm
            productos={productos}
            onSubmit={handleRegistrarEntrada}
            submitting={submitting}
          />
        </div>

        {/* Columna Derecha: Movimientos Recientes */}
        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title">📋 Trazabilidad de Movimientos</h3>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={cargarDatos}
              disabled={loading}
            >
              🔄 Actualizar
            </button>
          </div>

          <div className="table-responsive max-h-500">
            {loading ? (
              <div className="p-4 text-center">
                <div className="spinner"></div>
                <p>Cargando movimientos...</p>
              </div>
            ) : movimientos.length === 0 ? (
              <p className="text-muted text-center p-4">
                No hay movimientos de inventario registrados.
              </p>
            ) : (
              <table className="data-table data-table-sm">
                <thead>
                  <tr>
                    <th>Fecha / Hora</th>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-center">Resultante</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((m) => (
                    <tr key={m.id_movimiento}>
                      <td>
                        <small>
                          {new Date(m.fecha_hora).toLocaleDateString()} {' '}
                          {new Date(m.fecha_hora).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            m.tipo === 'ENTRADA'
                              ? 'badge-success'
                              : 'badge-danger'
                          }`}
                        >
                          {m.tipo}
                        </span>
                      </td>
                      <td>
                        <strong>{m.producto?.nombre || 'Producto'}</strong>
                        {m.referencia && (
                          <div className="text-muted text-xs">
                            Ref: {m.referencia}
                          </div>
                        )}
                      </td>
                      <td className="text-center font-bold">
                        {m.tipo === 'ENTRADA' ? `+${m.cantidad}` : `-${m.cantidad}`}
                      </td>
                      <td className="text-center">
                        <span className="font-mono">{m.stock_resultante} un.</span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {m.usuario?.nombre || m.usuario?.usuario || 'Sistema'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
