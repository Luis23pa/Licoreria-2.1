import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { productoService } from '../services/productoService'
import { ventaService } from '../services/ventaService'
import { VentaPOS } from '../modules/ventas/VentaPOS'
import { Alert } from '../components/Alert'

export const VentasPage = () => {
  const { user } = useAuth()
  const [productos, setProductos] = useState([])
  const [ventasRecientes, setVentasRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [alerta, setAlerta] = useState(null)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [resProd, resVentas] = await Promise.all([
        productoService.getProductos({ soloActivos: true }),
        ventaService.getVentas({ limit: 10 })
      ])

      if (resProd.success) setProductos(resProd.data)
      if (resVentas.success) setVentasRecientes(resVentas.data)
    } catch (err) {
      console.error('[VentasPage] Error cargando datos:', err)
      setAlerta({
        type: 'error',
        message: 'Error al conectar con el servidor de ventas.'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const handleFinalizarVenta = async ({ detalles, verificoEdad }) => {
    setSubmitting(true)
    setAlerta(null)
    try {
      const res = await ventaService.registrarVenta({
        id_usuario: user.id_usuario,
        detalles,
        verificoEdad
      })

      if (res.success) {
        setAlerta({ type: 'success', message: res.message })
        cargarDatos()
        return res
      } else {
        setAlerta({ type: 'error', message: res.message })
        return res
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Punto de Venta (HU04)</h2>
          <p className="page-description">
            Registro de ventas, cálculo automático de totales, verificación legal Ley 259 y salida de stock.
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

      {loading ? (
        <div className="p-8 text-center">
          <div className="spinner"></div>
          <p className="mt-2">Cargando terminal de ventas...</p>
        </div>
      ) : (
        <>
          <VentaPOS
            productos={productos}
            onFinalizarVenta={handleFinalizarVenta}
            submitting={submitting}
          />

          {/* Historial de Ventas Recientes */}
          <div className="card mt-6">
            <div className="card-header flex-between">
              <h3 className="card-title">🕒 Últimas Ventas Registradas</h3>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={cargarDatos}
              >
                🔄 Refrescar
              </button>
            </div>

            <div className="table-responsive">
              {ventasRecientes.length === 0 ? (
                <p className="text-muted text-center p-4">
                  No hay ventas registradas recientemente.
                </p>
              ) : (
                <table className="data-table data-table-sm">
                  <thead>
                    <tr>
                      <th>Nro. Venta</th>
                      <th>Fecha / Hora</th>
                      <th>Vendedor</th>
                      <th>Productos Vendidos</th>
                      <th className="text-right">Total Cobrado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasRecientes.map((v) => (
                      <tr key={v.id_venta}>
                        <td className="font-bold">#{v.id_venta}</td>
                        <td>
                          {new Date(v.fecha_hora).toLocaleDateString()} {' '}
                          {new Date(v.fecha_hora).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>
                          {v.usuario?.nombre || v.usuario?.usuario || 'Personal'}
                        </td>
                        <td>
                          <div className="sale-items-summary">
                            {v.detalle_venta?.map((dv) => (
                              <span key={dv.id_detalle} className="sale-item-badge">
                                {dv.cantidad}x {dv.producto?.nombre || 'Prod'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="text-right font-bold text-success font-mono">
                          Bs. {parseFloat(v.total).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
