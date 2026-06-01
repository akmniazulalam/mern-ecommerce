import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginInput({
      ...loginInput,
      [e.target.name]: e.target.value,
    });
  };

  const focusRef = useRef(null);

  useEffect(() => {
    const firstInput = focusRef.current?.querySelector("Input");
    firstInput?.focus();
  }, []);

  const handleLoginBtn = async () => {
    try {
      const res = await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/login",
        loginInput,
        { withCredentials: true },
      );

      setUser(res.data.user);

      toast.success("Login successfully done");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-muted w-full px-4">
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Login to your account
            </CardTitle>
          </CardHeader>

          <CardContent className={"space-y-4"}>
            <form
              onSubmit={handleSubmit}
              ref={focusRef}
              className={"space-y-4"}>
              <div>
                <Label className={"mb-2"}>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative">
                <Label className={"mb-2"}>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  name="password"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[69%] -translate-y-1/2 cursor-pointer">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              <Button
                className="w-full mt-2 cursor-pointer text-base dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]"
                onClick={handleLoginBtn}>
                Login
              </Button>
            </form>
            <p className="text-sm text-center mt-2">
              Not already an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/signup")}>
                Signup
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
