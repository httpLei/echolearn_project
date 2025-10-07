"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const classData = [
  { name: "Math 101", students: 32, avgGrade: 85, attendance: 94 },
  { name: "Math 201", students: 28, avgGrade: 78, attendance: 89 },
  { name: "Calculus I", students: 24, avgGrade: 82, attendance: 92 },
]

const assignmentStatus = [
  { name: "Submitted", value: 245, color: "hsl(var(--primary))" },
  { name: "Pending", value: 89, color: "hsl(var(--chart-2))" },
  { name: "Late", value: 23, color: "hsl(var(--destructive))" },
]

const studentEngagement = [
  { level: "High", count: 45 },
  { level: "Medium", count: 28 },
  { level: "Low", count: 12 },
]

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Overview of your classes and student performance.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">Across 3 classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Assignments to grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.7%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Average grades and attendance by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="avgGrade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assignment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
            <CardDescription>Current submission status across all classes</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assignmentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assignmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>Quick access to your classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {classData.map((classItem) => (
              <div
                key={classItem.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">{classItem.name}</h4>
                  <p className="text-xs text-muted-foreground">{classItem.students} students</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{classItem.avgGrade}% avg</Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>Engagement levels across all students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentEngagement.map((item) => (
              <div key={item.level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.level} Engagement</span>
                  <span className="text-muted-foreground">{item.count} students</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(item.count / 85) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">15 new submissions for Math 101 Quiz</p>
              <p className="text-xs text-muted-foreground">30 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">3 students missed deadline for Calculus assignment</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Math 201 class starting in 1 hour</p>
              <p className="text-xs text-muted-foreground">3 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
