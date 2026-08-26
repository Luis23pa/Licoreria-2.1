import { useState, useEffect, useCallback } from 'react'
import { productoService } from '../services/productoService'
import { ProductoTable } from '../modules/productos/ProductoTable'
import { ProductoForm } from '../modules/productos/ProductoForm'
import { Modal } from '../components/Modal'
import { Alert } from '../components/Alert'

export const ProductosPage = () => {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [idCategoriaFiltro, setIdCategoriaFiltro] = useState('')
  const [soloActivos, setSoloActivos] = useState(false)

  // Estado del Modal y Edición
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Notificaciones
  const [alerta, setAlerta] = useState(null)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [resProd, resCat] = await Promise.all([
        productoService.getProductos({
          busqueda,
          id_categoria: idCategoriaFiltro ? parseInt(idCategoriaFiltro, 10) : null,
          soloActivos
        }),
        productoService.getCategorias()
      ])

      if (resProd.success) setProductos(resProd.data)
      if (resCat.success) setCategorias(resCat.data)
    } catch (err) {
      console.error('[ProductosPage] Error al cargar datos:', err)
      setAlerta({ type: 'error', message: 'Error al conectar con la base de datos.' })
    } finally {
      setLoading(false)
    }
  }, [busqueda, idCategoriaFiltro, soloActivos])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const handleNuevoProducto = () => {
    setProductoSeleccionado(null)
    setIsModalOpen(true)
  }

  const handleEditarProducto = (prod) => {
    setProductoSeleccionado(prod)
    setIsModalOpen(true)
  }

  const handleDesactivar = async (prod) => {
    if (
      window.confirm(
        `¿Está seguro de desactivar el producto "${prod.nombre}"? Se mantendrá en el historial pero no estará disponible para ventas.`
      )
    ) {
      const res = await productoService.desactivarProducto(prod.id_producto)
      if (res.success) {
        setAlerta({ type: 'success', message: res.message })
        cargarDatos()
      } else {
        setAlerta({ type: 'error', message: res.message })
      }
    }
  }

  const handleReactivar = async (prod) => {
    const res = await productoService.reactivarProducto(prod.id_producto)
    if (res.success) {
      setAlerta({ type: 'success', message: res.message })
      cargarDatos()
    } else {
      setAlerta({ type: 'error', message: res.message })
    }
  }

  const handleSubmitForm = async (datos) => {
    setSubmitting(true)
    try {
      let res
      if (productoSeleccionado) {
        res = await productoService.actualizarProducto(
          productoSeleccionado.id_producto,
          datos
        )
      } else {
        res = await productoService.crearProducto(datos)
      }

      if (res.success) {
        setAlerta({ type: 'success', message: res.message })
        setIsModalOpen(false)
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
          <h2 className="page-title">Gestión de Productos (HU02)</h2>
          <p className="page-description">
            Catálogo central de licores, bebidas y control de precios/existencias.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNuevoProducto}
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {alerta && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="filter-bar card">
        <div className="filter-item filter-search">
          <label htmlFor="busqueda-prod">Buscar</label>
          <input
            id="busqueda-prod"
            type="text"
            className="form-control"
            placeholder="Buscar por código, nombre o marca..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="cat-filtro">Categoría</label>
          <select
            id="cat-filtro"
            className="form-control"
            value={idCategoriaFiltro}
            onChange={(e) => setIdCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item filter-checkbox">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={soloActivos}
              onChange={(e) => setSoloActivos(e.target.checked)}
            />
            <span>Solo productos activos</span>
          </label>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card">
        <ProductoTable
          productos={productos}
          loading={loading}
          onEditar={handleEditarProducto}
          onDesactivar={handleDesactivar}
          onReactivar={handleReactivar}
        />
      </div>

      {/* Modal de Alta/Edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={productoSeleccionado ? 'Editar Producto' : 'Registrar Nuevo Producto'}
        maxWidth="650px"
      >
        <ProductoForm
          producto={productoSeleccionado}
          categorias={categorias}
          onSubmit={handleSubmitForm}
          onCancel={() => setIsModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}
