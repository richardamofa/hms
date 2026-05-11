import './StatsCard.css'

interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-icon" style={{ backgroundColor: color + '15', color }}>
        {icon}
      </div>
      <div className="stats-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  )
}

export default StatsCard