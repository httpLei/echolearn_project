"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signup } = useAuth()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await signup(email, username, password, role)
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#CCCCCC]">
          <h1 className="text-3xl font-bold mb-8 text-center text-[#1D1616]">Sign Up</h1>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[#1D1616]">I am a</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as "student" | "teacher")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="font-normal cursor-pointer">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher" className="font-normal cursor-pointer">
                    Teacher
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1D1616]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-[#CCCCCC]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#1D1616]">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-white border-[#CCCCCC]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1D1616]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-white border-[#CCCCCC]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#1D1616]">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 bg-white border-[#CCCCCC]"
                required
              />
            </div>

            {error && <p className="text-sm text-[#8E1616]">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-[#8E1616] hover:bg-[#6E1111] text-white"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#8E1616] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
