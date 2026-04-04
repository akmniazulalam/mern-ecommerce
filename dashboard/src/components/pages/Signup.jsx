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
import axios from "axios";
import toast from "react-hot-toast";
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
      toast.error(error.response?.data?.message)
    }
  };
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
        toast.error(error.response?.data?.message ||"Registration failed");
      });
  };
  return (
    <>
      <Helmet>
        <title>Signup</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-muted">
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
            </div>

            <Button
              onClick={handleRegistration}
              className="w-full mt-2 cursor-pointer dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]">
              Sign Up
            </Button>

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>Login</span>
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

                <Button onClick={handleVerifyOtp} className="w-full cursor-pointer dark:text-white bg-linear-to-r from-[#5e5eee] via-[#3d76dc] to-[#3594d5]">
                  Verify OTP
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
