"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Clock, Archive, AlertCircle, MessageSquare, MoreVertical } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  type: "assignment" | "message" | "announcement"
  priority: "high" | "medium" | "low"
  read: boolean
  snoozed: boolean
  createdAt: Date
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Assignment Due Soon",
    message: "Familiarizing GIT and Python Django",
    type: "assignment",
    priority: "high",
    read: false,
    snoozed: false,
    createdAt: new Date("2025-10-06T08:59:48"),
  },
  {
    id: "2",
    title: "New Message",
    message: "Prof. Amparo replied to your question about the Django",
    type: "message",
    priority: "medium",
    read: false,
    snoozed: false,
    createdAt: new Date("2025-10-06T05:59:48"),
  },
  {
    id: "3",
    title: "Class Reminder",
    message: "CSIT340 class starts in 30 minutes",
    type: "announcement",
    priority: "medium",
    read: false,
    snoozed: true,
    createdAt: new Date("2025-10-06T09:30:00"),
  },
  {
    id: "4",
    title: "Grade Posted",
    message: "Your Noli Me Tangere Reflection grade has been posted",
    type: "announcement",
    priority: "low",
    read: false,
    snoozed: false,
    createdAt: new Date("2025-10-05T14:20:00"),
  },
  {
    id: "5",
    title: "New Assignment",
    message: "Data Visualization",
    type: "assignment",
    priority: "low",
    read: true,
    snoozed: false,
    createdAt: new Date("2025-10-05T10:00:00"),
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState<"unread" | "all" | "snoozed">("unread")

  const unreadCount = notifications.filter((n) => !n.read).length
  const snoozedCount = notifications.filter((n) => n.snoozed).length
  const totalCount = notifications.length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read
    if (activeTab === "snoozed") return n.snoozed
    return true
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <AlertCircle className="h-5 w-5" />
      case "message":
        return <MessageSquare className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#1D1616]">Notifications</h1>
            </div>
            <Button onClick={markAllAsRead} variant="ghost" className="text-[#1D1616] hover:bg-[#F5F5F5]">
              <Clock className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-[#DDDDDD]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#666666] mb-1">Unread</p>
                    <p className="text-4xl font-bold text-[#1D1616]">{unreadCount}</p>
                  </div>
                  <Bell className="h-8 w-8 text-[#8E1616]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#DDDDDD]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#666666] mb-1">Snoozed</p>
                    <p className="text-4xl font-bold text-[#1D1616]">{snoozedCount}</p>
                  </div>
                  <Clock className="h-8 w-8 text-[#FFBC4C]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#DDDDDD]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#666666] mb-1">Total</p>
                    <p className="text-4xl font-bold text-[#1D1616]">{totalCount}</p>
                  </div>
                  <Archive className="h-8 w-8 text-[#666666]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-[#DDDDDD]">
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "unread"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("snoozed")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "snoozed"
                  ? "text-[#1D1616] border-b-2 border-[#8E1616]"
                  : "text-[#666666] hover:text-[#1D1616]"
              }`}
            >
              Snoozed ({snoozedCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-white border-2 ${
                  notification.priority === "high" ? "border-[#8E1616]" : "border-[#DDDDDD]"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        notification.type === "assignment"
                          ? "bg-[#8E1616] text-white"
                          : notification.type === "message"
                            ? "bg-[#FFBC4C] text-[#1D1616]"
                            : "bg-[#EEEEEE] text-[#1D1616]"
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[#1D1616]">{notification.title}</h4>
                            {!notification.read && <div className="h-2 w-2 rounded-full bg-[#8E1616]" />}
                          </div>
                          <p className="text-sm text-[#666666]">{notification.message}</p>
                          <p className="text-xs text-[#999999]">
                            {notification.createdAt.toLocaleDateString()} {notification.createdAt.toLocaleTimeString()}
                          </p>
                        </div>

                        <Button variant="ghost" size="icon" className="text-[#666666] hover:bg-[#F5F5F5]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-[#CCCCCC] text-[#1D1616] hover:bg-[#F5F5F5]"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
