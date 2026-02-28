import React from 'react'
import { NavLink } from "react-router-dom"
import { LayoutDashboard, ShoppingCart, Package, Settings, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Category", icon: Layers, path: "/category" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ]
  return (
    <aside className="w-64 bg-background border-r hidden md:flex flex-col">
      <div className="p-6 text-xl font-bold">E-Commerce</div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar