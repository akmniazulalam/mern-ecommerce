import { useDispatch } from "react-redux"
import { verifyOtp, resendOtp } from "@/redux/authSlice"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function VerifyOtp() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const email = params.get("email")
  const [otp, setOtp] = useState("")

  const handleVerify = async () => {
    const res = await dispatch(verifyOtp({ email, otp }))

    if (res.payload?.message === "Email Verification Done") {
      navigate("/login")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl text-center">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to {email}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button onClick={handleVerify} className="w-full">
            Verify
          </Button>

          <Button
            variant="ghost"
            onClick={() => dispatch(resendOtp({ email }))}
            className="w-full"
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}