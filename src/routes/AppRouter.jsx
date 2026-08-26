import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProductosPage } from '../pages/ProductosPage'
import { InventarioPage } from '../pages/InventarioPage'
import { VentasPage } from '../pages/VentasPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas de Autenticación (Públicas) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rutas Protegidas de la Aplicación */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
