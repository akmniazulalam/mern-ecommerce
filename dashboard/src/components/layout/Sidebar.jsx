import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  Layers,
  List,
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Category", icon: Layers, path: "/category" },
    { name: "CategoryList", icon: List, path: "/categorylist" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ]

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center p-4 border-b bg-background">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="p-0 w-64 h-full">
            <div className="flex flex-col h-full bg-background">
              <div className="p-6 text-xl font-bold border-b">E-Commerce</div>
              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
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
            </div>
          </DialogContent>
        </Dialog>

        <div className="ml-4 font-bold text-lg">Dashboard</div>
      </div>

      {/* Desktop Sidebar */}
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
    </>
  )
}

export default Sidebar