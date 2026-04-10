import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
  const handleLoginBtn = async () => {
    try {
      await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/login",
        loginInput,
        {withCredentials: true}
      );
      toast.success("Login successfully done");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message);
    }
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
            <div>
              <Label className={"mb-2"}>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label className={"mb-2"}>Password</Label>
              <Input
                type="password"
                placeholder="**********"
                name="password"
                onChange={handleInputChange}
              />
            </div>

            <Button
              className="w-full mt-2 cursor-pointer text-base dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]"
              onClick={handleLoginBtn}>
              Login
            </Button>
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
