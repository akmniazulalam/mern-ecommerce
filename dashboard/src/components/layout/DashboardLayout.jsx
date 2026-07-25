import React from 'react'
import {Sidebar} from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-muted/40">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
