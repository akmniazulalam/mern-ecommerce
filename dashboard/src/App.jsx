import { Routes, Route } from "react-router-dom"
import './App.css'
import DashboardLayout from "./components/layout/DashboardLayout"
import Dashboard from "./components/pages/Dashboard"
import Products from "./components/pages/Products"
import Orders from "./components/pages/Orders"
import Category from "./components/pages/Category"
import Settings from "./components/pages/Settings"
import CategoryList from "./components/pages/CategoryList"

function App() {

  return (
    <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/category" element={<Category />} />
          <Route path="/categorylist" element={<CategoryList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
  )
}

export default App
