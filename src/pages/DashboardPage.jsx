import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productoService } from '../services/productoService'
import { ventaService } from '../services/ventaService'

export const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockBajoCount: 0,
    totalVentasHoy: 0,
    montoVentasHoy: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resProd, resVentas] = await Promise.all([
          productoService.getProductos(),
          ventaService.getVentas({ limit: 50 })
        ])

        const productos = resProd.success ? resProd.data : []
        const ventas = resVentas.success ? resVentas.data : []

        const stockBajo = productos.filter(
          (p) => p.estado && p.stock_actual <= p.stock_minimo
        )

        // Calcular ventas de hoy
        const hoy = new Date().toDateString()
        const ventasHoy = ventas.filter(
          (v) => new Date(v.fecha_hora).toDateString() === hoy
        )
        const totalMonto = ventasHoy.reduce(
          (acc, v) => acc + parseFloat(v.total || 0),
          0
        )

        setStats({
          totalProductos: productos.length,
          stockBajoCount: stockBajo.length,
          totalVentasHoy: ventasHoy.length,
          montoVentasHoy: totalMonto
        })
      } catch (err) {
        console.error('Error cargando métricas de dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Banner de Bienvenida */}
      <div className="welcome-banner card">
        <div className="welcome-content">
          <h2 className="welcome-title">
            ¡Bienvenido/a, <span className="text-primary">{user?.nombre || 'Usuario'}</span>!
          </h2>
          <p className="welcome-subtitle">
            Sistema de Gestión para Licorería "Al Paso" — Control de Productos, Inventario y Ventas (Sprint 1).
          </p>
          <div className="welcome-badge-container">
            <span className="badge badge-info">Rol: {user?.rol || 'Personal'}</span>
            <span className="badge badge-success">Sesión Activa</span>
          </div>
        </div>
        <div className="welcome-illustration">🍷</div>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="metrics-grid">
        <div className="metric-card card">
          <div className="metric-icon bg-amber">🍾</div>
          <div className="metric-info">
            <span className="metric-label">Catálogo de Licores</span>
            <h3 className="metric-value">
              {loading ? '...' : stats.totalProductos}
            </h3>
            <span className="metric-subtext">Productos registrados</span>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon bg-red">⚠️</div>
          <div className="metric-info">
            <span className="metric-label">Alertas de Stock</span>
            <h3 className="metric-value text-warning">
              {loading ? '...' : stats.stockBajoCount}
            </h3>
            <span className="metric-subtext">En o bajo stock mínimo</span>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon bg-blue">🧾</div>
          <div className="metric-info">
            <span className="metric-label">Ventas del Día</span>
            <h3 className="metric-value">
              {loading ? '...' : stats.totalVentasHoy}
            </h3>
            <span className="metric-subtext">Operaciones completadas</span>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon bg-green">💰</div>
          <div className="metric-info">
            <span className="metric-label">Ingresos del Día</span>
            <h3 className="metric-value text-success">
              Bs. {loading ? '0.00' : stats.montoVentasHoy.toFixed(2)}
            </h3>
            <span className="metric-subtext">Total facturado hoy</span>
          </div>
        </div>
      </div>

      {/* Módulos Principales de Acceso Rápido */}
      <h3 className="section-title mt-6 mb-4">Módulos del Sistema</h3>
      <div className="modules-grid">
        <Link to="/productos" className="module-action-card card">
          <div className="module-icon">🍾</div>
          <div className="module-info">
            <h4 className="module-title">Gestionar Productos (HU02)</h4>
            <p className="module-desc">
              Registrar nuevos licores, modificar precios, configurar stock mínimo y consultar catálogo.
            </p>
          </div>
          <span className="module-arrow">→</span>
        </Link>

        <Link to="/inventario" className="module-action-card card">
          <div className="module-icon">📦</div>
          <div className="module-info">
            <h4 className="module-title">Entradas de Inventario (HU03)</h4>
            <p className="module-desc">
              Ingresar stock de mercadería recibida y mantener la trazabilidad de existencias.
            </p>
          </div>
          <span className="module-arrow">→</span>
        </Link>

        <Link to="/ventas" className="module-action-card card">
          <div className="module-icon">💰</div>
          <div className="module-info">
            <h4 className="module-title">Punto de Venta / Ventas (HU04)</h4>
            <p className="module-desc">
              Cobro rápido, carrito interactivo, control de edad (Ley 259) y salida automática de stock.
            </p>
          </div>
          <span className="module-arrow">→</span>
        </Link>
      </div>
    </div>
  )
}
