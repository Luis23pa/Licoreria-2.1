import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'

export const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <Navbar />
        <main className="main-container">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
