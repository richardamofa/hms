import { useEffect, useState } from 'react'
import { FaHospital, FaUserMd, FaCalendarAlt } from 'react-icons/fa'
import StatsCard from '@/components/StatsCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { dashboardApi } from '@/api/dashboard'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardApi.getStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of hospital operations</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<FaHospital />}
          color="#3b82f6"
        />
        <StatsCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={<FaUserMd />}
          color="#10b981"
        />
        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<FaCalendarAlt />}
          color="#f59e0b"
        />
      </div>

      <div className="dashboard-welcome">
        <h2>Welcome to Hospital Management System</h2>
        <p>
          Use the sidebar to navigate between patients, doctors, and appointments.
          All data is securely stored and managed through Supabase.
        </p>
      </div>
    </div>
  )
}

export default Dashboard