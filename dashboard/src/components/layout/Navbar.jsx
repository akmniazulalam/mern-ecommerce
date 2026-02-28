import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

const Navbar = () => {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <Input placeholder="Search..." className="max-w-sm" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>

        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
          NA
        </div>
      </div>
    </header>
  )
}

export default Navbar