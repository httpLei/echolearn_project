"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CalendarEvent } from "@/lib/calendar-types"

interface CalendarViewProps {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, firstDay, lastDay }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "assignment":
        return "bg-primary/20 text-primary border-primary/30"
      case "class":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      case "exam":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "meeting":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "personal":
        return "bg-chart-5/20 text-chart-5 border-chart-5/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-24 p-2 border border-transparent" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const dayEvents = getEventsForDay(day)
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`min-h-24 p-2 border border-border rounded-lg ${
                  isToday ? "bg-primary/5 border-primary" : "bg-card"
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={`w-full text-left text-xs p-1 rounded border ${getEventColor(event.type)} hover:opacity-80 transition-opacity`}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      {!event.allDay && (
                        <div className="text-xs opacity-75">
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary/20 border border-primary/30" />
            <span className="text-xs text-muted-foreground">Assignment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-chart-2/20 border border-chart-2/30" />
            <span className="text-xs text-muted-foreground">Class</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-destructive/20 border border-destructive/30" />
            <span className="text-xs text-muted-foreground">Exam</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-chart-4/20 border border-chart-4/30" />
            <span className="text-xs text-muted-foreground">Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-chart-5/20 border border-chart-5/30" />
            <span className="text-xs text-muted-foreground">Personal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
