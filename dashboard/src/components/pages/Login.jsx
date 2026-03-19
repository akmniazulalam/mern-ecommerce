import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted w-full">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login to your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <div>
              <Label className={"mb-2"}>Email</Label>
              <Input type="email" placeholder="Enter your email" />
            </div>

            <div>
              <Label className={"mb-2"}>Password</Label>
              <Input type="password" placeholder="**********" />
            </div>

            <Button className="w-full mt-2 cursor-pointer">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
