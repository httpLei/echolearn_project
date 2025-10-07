export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  type: "assignment" | "class" | "exam" | "meeting" | "personal"
  location?: string
  color?: string
  allDay?: boolean
  recurring?: {
    frequency: "daily" | "weekly" | "monthly"
    endDate?: Date
  }
  assignmentId?: string
  classId?: string
  reminders?: {
    time: number // minutes before event
    sent: boolean
  }[]
}

export interface CalendarSync {
  id: string
  provider: "google" | "outlook" | "apple"
  email: string
  lastSync: Date
  enabled: boolean
}
