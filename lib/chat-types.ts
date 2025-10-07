export interface Chat {
  id: string
  name: string
  type: "direct" | "group" | "class"
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: Date
  parentChatId?: string // For side chats
  isSideChat?: boolean
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
  replyTo?: string
  edited?: boolean
  reactions?: {
    emoji: string
    userIds: string[]
  }[]
}

export interface FileAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}
