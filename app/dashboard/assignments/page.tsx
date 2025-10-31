"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Clock, AlertCircle, CheckCircle2, ArrowUpDown } from "lucide-react"

type Assignment = {
  id: string
  title: string
  description: string
  dueDate?: Date | null
  estimatedTime: number // in minutes
  subject: string
  difficulty: "Easy" | "Medium" | "Hard"
  completed: boolean
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Familiarizing GIT and Python Django",
    description: "To familiarize yourself with Git version control processes and Python Django framework through the creation of two distinct projects, each in its own public repository.",
    dueDate: new Date("2025-10-06"),
    estimatedTime: 180,
    subject: "CSIT327",
    difficulty: "Hard",
    completed: false,
  },
  {
    id: "2",
    title: "Data Visualization",
    description: "Create the pivot tables (label your tables' headers accordingly) below and add/put their charts in a DASHBOARD (1st sheet)",
    dueDate: new Date("2025-11-30"),
    estimatedTime: 120,
    subject: "IT365",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: "3",
    title: "React Component Development",
    description: "Build a functional React component that displays dynamic user data using props and state.",
    dueDate: new Date("2025-10-08"),
    estimatedTime: 90,
    subject: "CSIT340",
    difficulty: "Medium",
    completed: false,
  },
  {
    id: "4",
    title: "Sprint 2 Progress Report",
    description: "Prepare a short report summarizing your team’s accomplishments, blockers, and next sprint goals.",
    dueDate: new Date("2025-10-04"),
    estimatedTime: 30,
    subject: "IT317",
    difficulty: "Easy",
    completed: false,
  },
  {
    id: "5",
    title: "Noli Me Tangere Reflection Essay",
    description: "Write a reflection paper discussing the relevance of Noli Me Tangere in today’s society.",
    dueDate: new Date("2025-11-15"),
    estimatedTime: 60,
    subject: "RIZAL103",
    difficulty: "Easy",
    completed: false,
  },
]

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [activeTab, setActiveTab] = useState<"all" | "overdue" | "today" | "week" | "upcoming">("all")

  const toggleComplete = (id: string) => {
    setAssignments(assignments.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)))
  }

  // Filter logic
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const filteredAssignments = assignments.filter((a) => {
    // Search filter
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

    // Subject filter
    if (subjectFilter !== "all" && a.subject !== subjectFilter) return false

    // Tab filter
    // If there is no due date, exclude from date-based tabs (only appear under "all")
    if (!a.dueDate) return activeTab === "all"

    const dueDate = new Date(a.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    if (activeTab === "overdue" && dueDate >= today) return false
    if (activeTab === "today" && dueDate.getTime() !== today.getTime()) return false
    if (activeTab === "week" && (dueDate < today || dueDate > weekFromNow)) return false
    if (activeTab === "upcoming" && dueDate <= weekFromNow) return false

    return true
  })

  const overdueCount = assignments.filter((a) => a.dueDate && new Date(a.dueDate) < today).length
  const todayCount = assignments.filter((a) => {
    if (!a.dueDate) return false
    const d = new Date(a.dueDate)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  }).length
  const weekCount = assignments.filter((a) => {
    if (!a.dueDate) return false
    const d = new Date(a.dueDate)
    d.setHours(0, 0, 0, 0)
    return d >= today && d <= weekFromNow
  }).length
  const upcomingCount = assignments.filter((a) => a.dueDate && new Date(a.dueDate) > weekFromNow).length

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#1D1616]">Assignments</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#CCCCCC] text-[#1D1616] placeholder:text-[#999999]"
              />
            </div>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white border-[#CCCCCC] text-[#1D1616]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#CCCCCC]">
                <SelectItem value="all" className="text-[#1D1616]">
                  All Subjects
                </SelectItem>
                <SelectItem value="RIZAL031" className="text-[#1D1616]">
                  RIZAL031
                </SelectItem>
                <SelectItem value="IT365" className="text-[#1D1616]">
                  IT365
                </SelectItem>
                <SelectItem value="ES038" className="text-[#1D1616]">
                  ES038
                </SelectItem>
                <SelectItem value="CSIT327" className="text-[#1D1616]">
                  CSIT327
                </SelectItem>
                <SelectItem value="IT317" className="text-[#1D1616]">
                  IT317
                </SelectItem>
                <SelectItem value="CSIT340" className="text-[#1D1616]">
                  CSIT340
                </SelectItem>
                <SelectItem value="CSIT321" className="text-[#1D1616]">
                  CSIT321
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px] bg-white border-[#CCCCCC] text-[#1D1616]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Due Date" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#CCCCCC]">
                <SelectItem value="dueDate" className="text-[#1D1616]">
                  Due Date
                </SelectItem>
                <SelectItem value="difficulty" className="text-[#1D1616]">
                  Difficulty
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-[#DDDDDD] overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === "all"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              All ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab("overdue")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === "overdue"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === "today"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              Due Today ({todayCount})
            </button>
            <button
              onClick={() => setActiveTab("week")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === "week"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              This Week ({weekCount})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === "upcoming"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const isOverdue = assignment.dueDate ? new Date(assignment.dueDate) < today : false

              return (
                <Card
                  key={assignment.id}
                  className={`bg-white border-2 ${isOverdue ? "border-[#8E1616]" : "border-[#DDDDDD]"}`}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {isOverdue && <AlertCircle className="h-5 w-5 text-[#8E1616] mt-1" />}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#1D1616] mb-1">{assignment.title}</h3>
                            <p className="text-sm text-[#666666]">{assignment.description}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            assignment.difficulty === "Hard"
                              ? "bg-[#8E1616] text-white"
                              : assignment.difficulty === "Medium"
                                ? "bg-[#FFBC4C] text-[#1D1616]"
                                : "bg-[#EEEEEE] text-[#1D1616]"
                          }`}
                        >
                          {assignment.difficulty}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {" "}
                          {assignment.dueDate ? (
                            assignment.dueDate.toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            })
                          ) : (
                            <span className="text-[#999999]">No due date</span>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {assignment.estimatedTime} min
                        </span>
                        <span className="px-2 py-1 bg-[#FFF5E1] rounded text-[#8E1616] font-medium">
                          {assignment.subject}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={() => toggleComplete(assignment.id)}
                          className={
                            assignment.completed
                              ? "bg-[#FFBC4C] text-[#1D1616] hover:bg-[#E5A843]"
                              : "bg-[#8E1616] text-white hover:bg-[#6E1111]"
                          }
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}