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
  User,
  FolderPlus,
  PackagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const MobileSidebar = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 w-64 h-full translate-x-[0%] left-0">
        <div className="flex flex-col h-full bg-background">
          <div className="p-6 text-xl font-bold border-b">E-Commerce</div>
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
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
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <FolderPlus size={16} />
                  Add Category
                </NavLink>

                <NavLink
                  to="/categorylist"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <List size={16} />
                  Category List
                </NavLink>
              </div>
            )}
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

            <button
              onClick={() => setOpenProduct(!openProduct)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                Products
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  openProduct && "rotate-180",
                )}
              />
            </button>

            {openProduct && (
              <div className="ml-8 space-y-1">
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <PackagePlus size={16} />
                  Add Products
                </NavLink>

                <NavLink
                  to="/productlist"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )
                  }>
                  <Package size={16} />
                  Product List
                </NavLink>
              </div>
            )}
            <NavLink
              to="/userlists"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )
              }>
              <User className="w-5 h-5" />
              Userlists
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
  );
};

const Sidebar = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  return (
    <>

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
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )
                }>
                <FolderPlus size={16} />
                Add Category
              </NavLink>

              <NavLink
                to="/categorylist"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )
                }>
                <List size={16} />
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

          {/* Product Dropdown */}
          <button
            onClick={() => setOpenProduct(!openProduct)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              Products
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                openProduct && "rotate-180",
              )}
            />
          </button>

          {openProduct && (
            <div className="ml-8 space-y-1">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )
                }>
                <PackagePlus size={16} />
                Add Products
              </NavLink>

              <NavLink
                to="/productlist"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )
                }>
                <Package size={16} />
                Product List
              </NavLink>
            </div>
          )}
          <NavLink
            to="/userlists"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )
            }>
            <User className="w-5 h-5" />
            Userlists
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

export { Sidebar, MobileSidebar };
