import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  Layers,
  List,
  Menu,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Sidebar = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Category", icon: Layers, path: "/category" },
    { name: "CategoryList", icon: List, path: "/categorylist" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

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
                {/* {navItems.map((item) => (
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
                ))} */}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </NavLink>

                {/* Category Dropdown */}
                <button
                  onClick={() => setOpenCategory(!openCategory)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5" />
                    Category
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      openCategory && "rotate-180",
                    )}
                  />
                </button>

                {openCategory && (
                  <div className="ml-8 space-y-1">
                    <NavLink
                      to="/category"
                      className={({ isActive }) =>
                        cn(
                          "block px-4 py-2 rounded-md text-sm transition",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        )
                      }>
                      Add Category
                    </NavLink>

                    <NavLink
                      to="/categorylist"
                      className={({ isActive }) =>
                        cn(
                          "block px-4 py-2 rounded-md text-sm transition",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        )
                      }>
                      Category List
                    </NavLink>
                  </div>
                )}
                {/* Other Menu Items */}
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <ShoppingCart className="w-5 h-5" />
                  Orders
                </NavLink>

                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <Package className="w-5 h-5" />
                  Products
                </NavLink>

                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <Settings className="w-5 h-5" />
                  Settings
                </NavLink>
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
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )
            }>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          {/* Category Dropdown */}
          <button
            onClick={() => setOpenCategory(!openCategory)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5" />
              Category
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openCategory && "rotate-180",
              )}
            />
          </button>

          {openCategory && (
            <div className="ml-8 space-y-1">
              <NavLink
                to="/category"
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-2 rounded-md text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )
                }>
                Add Category
              </NavLink>

              <NavLink
                to="/categorylist"
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-2 rounded-md text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )
                }>
                Category List
              </NavLink>
            </div>
          )}
          {/* Other Menu Items */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )
            }>
            <ShoppingCart className="w-5 h-5" />
            Orders
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )
            }>
            <Package className="w-5 h-5" />
            Products
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )
            }>
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
