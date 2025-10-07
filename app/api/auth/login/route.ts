import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // TODO: Replace with actual Java backend API call
    // const response = await fetch('http://your-java-backend:8080/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })

    // Mock response for development
    const mockUser = {
      id: "1",
      email,
      username: email.split("@")[0],
      role: "student",
      firstName: "John",
      lastName: "Doe",
      createdAt: new Date(),
    }

    const mockToken = "mock-jwt-token-" + Date.now()

    return NextResponse.json({
      user: mockUser,
      token: mockToken,
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 401 })
  }
}
