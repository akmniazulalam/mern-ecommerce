import React from 'react'
import {Sidebar} from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { Info } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const DashboardLayout = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-muted/40">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          {user?.isDemoAdmin ? (
            <div className="mb-4 flex items-start gap-3 rounded-lg border bg-card p-3 text-sm shadow-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="font-medium">Demo Mode</p>
                <p className="text-muted-foreground">
                  You are signed in using a read-only demo account. You can
                  explore the dashboard, but all modification actions are
                  disabled.
                </p>
              </div>
            </div>
          ) : null}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
