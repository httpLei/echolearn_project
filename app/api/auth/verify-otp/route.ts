import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    // TODO: Replace with actual Java backend API call
    // const response = await fetch('http://your-java-backend:8080/api/auth/verify-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code }),
    // })

    // Mock response for development
    const mockUser = {
      id: "1",
      email: "student@university.edu",
      username: "student",
      role: "student",
      firstName: "John",
      lastName: "Doe",
      createdAt: new Date(),
    }

    const mockToken = "mock-jwt-token-verified-" + Date.now()

    return NextResponse.json({
      user: mockUser,
      token: mockToken,
    })
  } catch (error) {
    return NextResponse.json({ error: "OTP verification failed" }, { status: 401 })
  }
}
