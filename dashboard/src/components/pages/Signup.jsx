import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  type={"text"}
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  type={"text"}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

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
                placeholder="*********"
              />
            </div>

            <Button className="w-full mt-2">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
