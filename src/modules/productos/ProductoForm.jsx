import { useState, useEffect } from 'react'

/**
 * Formulario de creación y edición de productos (HU02, RN-05, RN-06, RN-07)
 */
export const ProductoForm = ({
  producto = null,
  categorias = [],
  onSubmit,
  onCancel,
  submitting = false
}) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    marca: '',
    precio_venta: '',
    stock_actual: 0,
    stock_minimo: 5,
    id_categoria: '',
    estado: true
  })

  const [errors, setErrors] = useState({})

  const isEditing = Boolean(producto?.id_producto)

  useEffect(() => {
    if (producto) {
      setFormData({
        codigo: producto.codigo || '',
        nombre: producto.nombre || '',
        marca: producto.marca || '',
        precio_venta: producto.precio_venta || '',
        stock_actual: producto.stock_actual ?? 0,
        stock_minimo: producto.stock_minimo ?? 0,
        id_categoria: producto.id_categoria || '',
        estado: producto.estado ?? true
      })
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        marca: '',
        precio_venta: '',
        stock_actual: 0,
        stock_minimo: 5,
        id_categoria: categorias.length > 0 ? categorias[0].id_categoria : '',
        estado: true
      })
    }
  }, [producto, categorias])

  const validate = () => {
    const newErrors = {}

    if (!formData.codigo?.trim()) {
      newErrors.codigo = 'El código es obligatorio.'
    } else if (formData.codigo.length > 20) {
      newErrors.codigo = 'El código no puede superar 20 caracteres.'
    }

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre del producto es obligatorio.'
    } else if (formData.nombre.length > 80) {
      newErrors.nombre = 'El nombre no puede superar 80 caracteres.'
    }

    if (formData.marca && formData.marca.length > 40) {
      newErrors.marca = 'La marca no puede superar 40 caracteres.'
    }

    if (!formData.id_categoria) {
      newErrors.id_categoria = 'Debe seleccionar una categoría.'
    }

    const precio = parseFloat(formData.precio_venta)
    if (isNaN(precio) || precio <= 0) {
      newErrors.precio_venta = 'El precio debe ser mayor a 0.'
    }

    const stockActual = parseInt(formData.stock_actual, 10)
    if (isNaN(stockActual) || stockActual < 0) {
      newErrors.stock_actual = 'El stock no puede ser negativo.'
    }

    const stockMin = parseInt(formData.stock_minimo, 10)
    if (isNaN(stockMin) || stockMin < 0) {
      newErrors.stock_minimo = 'El stock mínimo no puede ser negativo.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="producto-form">
      <div className="form-grid">
        {/* Código */}
        <div className="form-group">
          <label htmlFor="codigo">
            Código <span className="text-danger">*</span>
          </label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
            placeholder="Ej. LIC-001, WHI-002"
            value={formData.codigo}
            onChange={handleChange}
            disabled={submitting}
            maxLength={20}
          />
          {errors.codigo && <span className="invalid-feedback">{errors.codigo}</span>}
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="id_categoria">
            Categoría <span className="text-danger">*</span>
          </label>
          <select
            id="id_categoria"
            name="id_categoria"
            className={`form-control ${errors.id_categoria ? 'is-invalid' : ''}`}
            value={formData.id_categoria}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">-- Seleccionar Categoría --</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.id_categoria && (
            <span className="invalid-feedback">{errors.id_categoria}</span>
          )}
        </div>

        {/* Nombre */}
        <div className="form-group form-col-full">
          <label htmlFor="nombre">
            Nombre del Producto <span className="text-danger">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            placeholder="Ej. Whisky Johnnie Walker Black Label 750ml"
            value={formData.nombre}
            onChange={handleChange}
            disabled={submitting}
            maxLength={80}
          />
          {errors.nombre && <span className="invalid-feedback">{errors.nombre}</span>}
        </div>

        {/* Marca */}
        <div className="form-group">
          <label htmlFor="marca">Marca (Opcional)</label>
          <input
            id="marca"
            name="marca"
            type="text"
            className={`form-control ${errors.marca ? 'is-invalid' : ''}`}
            placeholder="Ej. Johnnie Walker, Fernet Branca"
            value={formData.marca}
            onChange={handleChange}
            disabled={submitting}
            maxLength={40}
          />
          {errors.marca && <span className="invalid-feedback">{errors.marca}</span>}
        </div>

        {/* Precio de Venta */}
        <div className="form-group">
          <label htmlFor="precio_venta">
            Precio Venta (Bs.) <span className="text-danger">*</span>
          </label>
          <input
            id="precio_venta"
            name="precio_venta"
            type="number"
            step="0.10"
            min="0.01"
            className={`form-control ${errors.precio_venta ? 'is-invalid' : ''}`}
            placeholder="0.00"
            value={formData.precio_venta}
            onChange={handleChange}
            disabled={submitting}
          />
          {errors.precio_venta && (
            <span className="invalid-feedback">{errors.precio_venta}</span>
          )}
        </div>

        {/* Stock Actual (solo editable al crear) */}
        <div className="form-group">
          <label htmlFor="stock_actual">
            Stock Inicial <span className="text-danger">*</span>
          </label>
          <input
            id="stock_actual"
            name="stock_actual"
            type="number"
            min="0"
            className={`form-control ${errors.stock_actual ? 'is-invalid' : ''}`}
            value={formData.stock_actual}
            onChange={handleChange}
            disabled={isEditing || submitting}
            title={
              isEditing
                ? 'Para modificar stock de un producto existente, use el módulo de Inventario.'
                : ''
            }
          />
          {isEditing && (
            <small className="text-muted">
              El stock de productos existentes se actualiza mediante Inventario/Ventas.
            </small>
          )}
          {errors.stock_actual && (
            <span className="invalid-feedback">{errors.stock_actual}</span>
          )}
        </div>

        {/* Stock Mínimo */}
        <div className="form-group">
          <label htmlFor="stock_minimo">
            Stock Mínimo (Alerta) <span className="text-danger">*</span>
          </label>
          <input
            id="stock_minimo"
            name="stock_minimo"
            type="number"
            min="0"
            className={`form-control ${errors.stock_minimo ? 'is-invalid' : ''}`}
            value={formData.stock_minimo}
            onChange={handleChange}
            disabled={submitting}
          />
          {errors.stock_minimo && (
            <span className="invalid-feedback">{errors.stock_minimo}</span>
          )}
        </div>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting
            ? 'Guardando...'
            : isEditing
            ? 'Guardar Cambios'
            : 'Crear Producto'}
        </button>
      </div>
    </form>
  )
}
