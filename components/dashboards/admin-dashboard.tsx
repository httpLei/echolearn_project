"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, BookOpen, Activity, TrendingUp, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const platformStats = [
  { month: "Jan", users: 1200, active: 980 },
  { month: "Feb", users: 1450, active: 1180 },
  { month: "Mar", users: 1680, active: 1420 },
  { month: "Apr", users: 1920, active: 1650 },
  { month: "May", users: 2150, active: 1890 },
  { month: "Jun", users: 2380, active: 2100 },
]

const departmentData = [
  { name: "Mathematics", teachers: 12, students: 340 },
  { name: "Science", teachers: 15, students: 425 },
  { name: "History", teachers: 8, students: 280 },
  { name: "English", teachers: 10, students: 310 },
  { name: "Arts", teachers: 6, students: 180 },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide analytics and management overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,380</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">51</div>
            <p className="text-xs text-muted-foreground">Across 5 departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">15 new this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total and active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={platformStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="active" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Teachers and students by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
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
                <Bar dataKey="teachers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="students" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Important notifications and issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Peak usage detected</p>
              <p className="text-xs text-muted-foreground">
                System experiencing 40% higher traffic than usual. All services operating normally.
              </p>
            </div>
            <Badge variant="secondary">Info</Badge>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Scheduled maintenance</p>
              <p className="text-xs text-muted-foreground">
                Database maintenance scheduled for Oct 10, 2025 at 2:00 AM EST. Expected downtime: 30 minutes.
              </p>
            </div>
            <Badge variant="destructive">Action Required</Badge>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">New user registrations</p>
              <p className="text-xs text-muted-foreground">45 new users registered in the last 24 hours.</p>
            </div>
            <Badge variant="secondary">Info</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
