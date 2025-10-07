import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    // TODO: Replace with actual Java backend API call
    // const response = await fetch(`http://your-java-backend:8080/api/dashboard/stats?role=${role}`, {
    //   headers: { 'Authorization': `Bearer ${token}` },
    // })

    // Mock response for development
    const mockStats = {
      student: {
        assignmentsDue: 8,
        completionRate: 94,
        studyTime: 23,
        averageGrade: 86.6,
      },
      teacher: {
        totalStudents: 84,
        pendingReviews: 23,
        avgAttendance: 91.7,
        atRiskStudents: 7,
      },
      admin: {
        totalUsers: 2380,
        activeTeachers: 51,
        activeCourses: 127,
        platformHealth: 99.8,
      },
    }

    return NextResponse.json(mockStats[role as keyof typeof mockStats] || mockStats.student)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
