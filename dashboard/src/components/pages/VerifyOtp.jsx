import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyOtp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl text-center">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to email
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Enter OTP" />

          <Button className="w-full cursor-pointer">Verify</Button>

          <Button variant="ghost" className="w-full cursor-pointer">
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
