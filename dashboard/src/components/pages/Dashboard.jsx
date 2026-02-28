import React from 'react'
import StatsCard from '../StatsCard'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value="$45,231" />
        <StatsCard title="Orders" value="1,350" />
        <StatsCard title="Customers" value="820" />
        <StatsCard title="Products" value="120" />
      </div>
    </div>
  )
}

export default Dashboard