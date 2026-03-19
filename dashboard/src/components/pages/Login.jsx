import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const Login = () => {
  return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="**********"
              />
            </div>

            <Button className="w-full mt-2">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
