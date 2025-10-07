export type UserRole = "student" | "teacher" | "admin"

export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  firstName: string
  lastName: string
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: Date
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: number // in minutes
  subject: string
  teacherId: string
  classId: string
  priority?: number
  completed?: boolean
}

export interface Notification {
  id: string
  userId: string
  type: "assignment" | "deadline" | "message" | "announcement"
  title: string
  message: string
  priority: "low" | "medium" | "high"
  read: boolean
  snoozedUntil?: Date
  createdAt: Date
  actionUrl?: string
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  attachments?: FileAttachment[]
}

export interface FileAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface StudentStatus {
  userId: string
  userName: string
  wifiStrength: "excellent" | "good" | "fair" | "poor"
  connectionStatus: "online" | "offline" | "away"
  engagementLevel: number // 0-100
  lastActive: Date
}
