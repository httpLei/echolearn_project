"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { GraduationCap, LayoutDashboard, Bell, Menu, FileText, Settings } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, enabled: true },
    { href: "/dashboard/assignments", label: "Assignments", icon: FileText, enabled: true },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, enabled: true },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200">
          <GraduationCap className="h-6 w-6 text-[#8E1616]" />
          <span className="text-xl font-bold text-[#1D1616]">EchoLearn</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            if (item.enabled) {
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-11 ${
                      isActive ? "bg-[#8E1616] text-white hover:bg-[#6E1111]" : "text-[#1D1616] hover:bg-gray-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            } else {
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start h-11 text-gray-400 cursor-not-allowed opacity-50"
                  disabled
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              )
            }
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-[#8E1616] flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || "J"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1D1616] truncate">{user?.name || "John Doe"}</p>
              <p className="text-xs text-gray-500 truncate">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white flex items-center px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 text-[#1D1616]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          {/* Notification and Settings icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="text-[#1D1616] hover:bg-gray-100">
              <Link href="/dashboard/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="text-[#1D1616] hover:bg-gray-100" >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
