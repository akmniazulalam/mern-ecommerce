import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [registrationInput, setRegistrationInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setRegistrationInput({
      ...registrationInput,
      [e.target.name]: e.target.value,
    });
  };
  const handleRegistration = () => {
    axios
      .post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/signup",
        registrationInput,
      )
      .then(() => {
        toast.success("Registration done & send a verification otp to your email")
      })
      .catch(() => {
        toast.error("Registration failed")
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
              className="w-full mt-2 cursor-pointer">
              Sign Up
            </Button>

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <span className="text-blue-500 cursor-pointer">Login</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Signup;
