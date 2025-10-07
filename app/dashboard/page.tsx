"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {user?.role === "student" && <StudentDashboard />}
        {user?.role === "teacher" && <TeacherDashboard />}
        {user?.role === "admin" && <AdminDashboard />}
      </DashboardLayout>
    </ProtectedRoute>
  )
}
