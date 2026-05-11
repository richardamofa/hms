import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { MdDashboard, MdLocalHospital, MdCalendarMonth, MdLogout } from 'react-icons/md'
import { FaUserMd } from 'react-icons/fa'
import '../styles/Layout.css'

const Layout = () => {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/patients', label: 'Patients', icon: <MdLocalHospital /> },
    { path: '/doctors', label: 'Doctors', icon: <FaUserMd /> },
    { path: '/appointments', label: 'Appointments', icon: <MdCalendarMonth /> },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1><MdLocalHospital /> HMS</h1>
          <p>Hospital Management</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <MdLogout /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout