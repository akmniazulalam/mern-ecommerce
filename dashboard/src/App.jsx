import { Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./components/pages/Dashboard";
import Products from "./components/pages/Products";
import Orders from "./components/pages/Orders";
import Category from "./components/pages/Category";
import Settings from "./components/pages/Settings";
import CategoryList from "./components/pages/CategoryList";
import UpdateCategory from "./components/pages/UpdateCategory";
import ProductList from "./components/pages/ProductList";
import UpdateProduct from "./components/pages/UpdateProduct";
import AuthLayout from "./components/layout/AuthLayout";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import VerifyOtp from "./components/pages/VerifyOtp";
import { useEffect } from "react";

function App() {
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");  //document.documentElement = <html> tag
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<VerifyOtp />} />
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/updateproduct/:id" element={<UpdateProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/category" element={<Category />} />
        <Route path="/updatecategory/:id" element={<UpdateCategory />} />
        <Route path="/categorylist" element={<CategoryList />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
