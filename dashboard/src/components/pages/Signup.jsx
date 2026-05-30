import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [registrationInput, setRegistrationInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setRegistrationInput({
      ...registrationInput,
      [e.target.name]: e.target.value,
    });
  };
  const passwordRules = {
    minLength: registrationInput.password.length >= 8,
    uppercase: (registrationInput.password.match(/[A-Z]/g) || []).length >= 2,
    lowercase: (registrationInput.password.match(/[a-z]/g) || []).length >= 3,
    numbers: (registrationInput.password.match(/[0-9]/g) || []).length >= 2,
    special: /[!@#$&*]/.test(registrationInput.password),
  };
  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.numbers &&
    passwordRules.special;

  const isFormValid =
    isPasswordValid &&
    registrationInput.firstName &&
    registrationInput.lastName;
  const handleRegistration = () => {
    axios
      .post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/signup",
        registrationInput,
      )
      .then(() => {
        toast.success(
          `Registration done & send a verification otp to your email`,
        );
        setTimeout(() => {
          setOpenOtpModal(true);
        }, 2000);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            error?.message ||
            "Registration failed",
        );
      });
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/otpverify",
        {
          email: registrationInput.email,
          otp: otp,
        },
      );
      toast.success("Otp verification done");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message);
    }
  };

  const handleResetOtp = async () => {
    try {
      const response = await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/resendotp",
        {
          email: registrationInput.email,
        },
      );
      toast.success(response?.data?.message || "Otp resend successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error?.message);
    }
  };
  return (
    <>
      <Helmet>
        <title>Signup</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-muted px-4">
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl ">Create Your Account</CardTitle>
            <CardDescription className={"max-w-80"}>
              Enter your Name, Email & Password below to create to your account
            </CardDescription>
          </CardHeader>

          <CardContent className={"space-y-4"}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className={"mb-2"}>First Name</Label>
                <Input
                  onChange={handleChange}
                  name="firstName"
                  type={"text"}
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <Label className={"mb-2"}>Last Name</Label>
                <Input
                  onChange={handleChange}
                  name="lastName"
                  type={"text"}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <Label className={"mb-2"}>Email</Label>
              <Input
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label className={"mb-2"}>Password</Label>
              <Input
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="*********"
              />

              <div className="mt-3 text-sm space-y-1">
                <p
                  className={
                    passwordRules.minLength ? "text-green-500" : "text-red-500"
                  }>
                  {passwordRules.minLength ? "✅" : "❌"} Minimum 8 characters
                </p>

                <p
                  className={
                    passwordRules.uppercase ? "text-green-500" : "text-red-500"
                  }>
                  {passwordRules.uppercase ? "✅" : "❌"} At least 2 uppercase
                  letters
                </p>

                <p
                  className={
                    passwordRules.lowercase ? "text-green-500" : "text-red-500"
                  }>
                  {passwordRules.lowercase ? "✅" : "❌"} At least 3 lowercase
                  letters
                </p>

                <p
                  className={
                    passwordRules.numbers ? "text-green-500" : "text-red-500"
                  }>
                  {passwordRules.numbers ? "✅" : "❌"} At least 2 numbers
                </p>

                <p
                  className={
                    passwordRules.special ? "text-green-500" : "text-red-500"
                  }>
                  {passwordRules.special ? "✅" : "❌"} At least 1 special
                  character
                </p>
              </div>
            </div>

            <Button
              disabled={!isFormValid}
              onClick={handleRegistration}
              className={`w-full mt-2 cursor-pointer dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]`}>
              Sign Up
            </Button>

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </CardContent>
        </Card>
        {openOtpModal && (
          <Dialog open={openOtpModal} onOpenChange={setOpenOtpModal}>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Verify OTP</DialogTitle>
                <DialogDescription>
                  Enter the 6-digit OTP sent to your {registrationInput.email}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className={"text-center"}
                />

                <Button
                  onClick={handleVerifyOtp}
                  className="w-full cursor-pointer dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]">
                  Verify OTP
                </Button>
                <Button
                  onClick={handleResetOtp}
                  variant="ghost"
                  className="w-full cursor-pointer">
                  Resend OTP
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Signup;
