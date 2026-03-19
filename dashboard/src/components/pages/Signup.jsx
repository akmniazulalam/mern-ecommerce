import { useDispatch } from "react-redux"
import { signupUser } from "@/redux/authSlice"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(signupUser(form))

    if (res.payload?.message === "Data send") {
      navigate(`/verify-otp?email=${form.email}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <Button className="w-full mt-2">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}