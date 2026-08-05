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
import apiClient from "@/lib/apiClient";

import { authPaths } from "@/lib/productApi";

const DEMO_EMAIL = "akmniazulalam@yahoo.com";
const DEMO_PASSWORD = "N!@zulAlam481";

const Login = () => {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [eyeOn, setEyeOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (e.target.name === "password") {
      if (e.target.value.length > 0) {
        setEyeOn(true);
      } else {
        setEyeOn(false);
      }
    }
  };

  const focusRef = useRef(null);

  useEffect(() => {
    const firstInput = focusRef.current?.querySelector("Input");
    firstInput?.focus();
  }, []);

  const handleLoginBtn = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiClient.post(authPaths.login, loginInput);

      if (res.data.user?.role !== "admin") {
        await apiClient.post(authPaths.logout, {}).catch(() => {});
        setUser(null);
        toast.error("Only admin accounts can access the dashboard");
        return;
      }

      setUser(res.data.user);

      toast.success("Login successfully done");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const copyToClipboard = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value); // navigator hocche browser er built-in API ja clipboard e text copy korte use hoy. navigator.clipboard.writeText(value) method ta use kore value ke clipboard e copy kora hoy. eta promise return kore, tai await use kora hoy.
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-muted w-full px-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <Card className="w-full shadow-xl rounded-2xl">
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
                  <Label htmlFor="login-email" className={"mb-2 block"}>Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="login-password" className={"mb-2 block"}>Password</Label>
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    onChange={handleInputChange}
                  />
                  {eyeOn && (
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[69%] -translate-y-1/2 cursor-pointer">
                      {showPassword ? (
                        <Eye className="w-5 h-5 text-black dark:text-white" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-black dark:text-white" />
                      )}
                    </button>
                  )}
                </div>

                <Button
                  disabled={isSubmitting}
                  className="w-full mt-2 cursor-pointer text-base dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]"
                  onClick={handleLoginBtn}>
                  {isSubmitting ? "Logging in..." : "Login"}
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

          <Card className="w-full rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Demo Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this account to explore the Admin Dashboard in read-only mode.
              </p>

              <div className="space-y-3">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <code className="break-all text-sm">{DEMO_EMAIL}</code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 cursor-pointer"
                      onClick={() => copyToClipboard("Email", DEMO_EMAIL)}>
                      Copy Email
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs font-medium text-muted-foreground">Password</p>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <code className="break-all text-sm">{DEMO_PASSWORD}</code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 cursor-pointer"
                      onClick={() => copyToClipboard("Password", DEMO_PASSWORD)}>
                      Copy Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
