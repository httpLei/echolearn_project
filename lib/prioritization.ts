import type { Assignment, Notification } from "./types"

export interface PriorityScore {
  score: number
  factors: {
    urgency: number
    difficulty: number
    estimatedTime: number
    importance: number
  }
}

export function calculatePriorityScore(assignment: Assignment): PriorityScore {
  const now = new Date()
  const dueDate = new Date(assignment.dueDate)
  const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  // Urgency factor (0-100): Higher score for closer deadlines
  let urgency = 0
  if (hoursUntilDue < 24) urgency = 100
  else if (hoursUntilDue < 48) urgency = 80
  else if (hoursUntilDue < 72) urgency = 60
  else if (hoursUntilDue < 168) urgency = 40
  else urgency = 20

  // Difficulty factor (0-100)
  const difficultyMap = { easy: 30, medium: 60, hard: 100 }
  const difficulty = difficultyMap[assignment.difficulty]

  // Time factor (0-100): Higher score for longer assignments
  const estimatedTime = Math.min((assignment.estimatedTime / 180) * 100, 100)

  // Importance factor (0-100): Based on subject priority or custom settings
  const importance = assignment.priority || 50

  // Calculate weighted score
  const score = urgency * 0.4 + difficulty * 0.25 + estimatedTime * 0.2 + importance * 0.15

  return {
    score: Math.round(score),
    factors: {
      urgency,
      difficulty,
      estimatedTime,
      importance,
    },
  }
}

export function sortAssignmentsByPriority(assignments: Assignment[]): Assignment[] {
  return [...assignments].sort((a, b) => {
    const scoreA = calculatePriorityScore(a).score
    const scoreB = calculatePriorityScore(b).score
    return scoreB - scoreA
  })
}

export function shouldResurfaceNotification(notification: Notification): boolean {
  if (notification.read) return false
  if (notification.snoozedUntil && new Date(notification.snoozedUntil) > new Date()) return false

  const now = new Date()
  const createdAt = new Date(notification.createdAt)
  const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

  // Resurface high priority notifications every 4 hours
  if (notification.priority === "high" && hoursSinceCreated >= 4) return true

  // Resurface medium priority notifications every 12 hours
  if (notification.priority === "medium" && hoursSinceCreated >= 12) return true

  // Resurface low priority notifications every 24 hours
  if (notification.priority === "low" && hoursSinceCreated >= 24) return true

  return false
}

export function groupAssignmentsByCategory(assignments: Assignment[]) {
  const now = new Date()

  return {
    overdue: assignments.filter((a) => new Date(a.dueDate) < now && !a.completed),
    dueToday: assignments.filter((a) => {
      const due = new Date(a.dueDate)
      return due.toDateString() === now.toDateString() && !a.completed
    }),
    dueThisWeek: assignments.filter((a) => {
      const due = new Date(a.dueDate)
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return due > now && due <= weekFromNow && !a.completed
    }),
    upcoming: assignments.filter((a) => {
      const due = new Date(a.dueDate)
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return due > weekFromNow && !a.completed
    }),
    completed: assignments.filter((a) => a.completed),
  }
}
