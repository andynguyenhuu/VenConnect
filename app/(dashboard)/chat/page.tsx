import { ChatInterface } from '@/components/chat/chat-interface'
import { ConversationSidebar } from '@/components/chat/conversation-sidebar'

export default function ChatPage() {
  return (
    <div className="flex h-full">
      {/* Conversation History Sidebar */}
      <aside className="hidden md:flex w-64 border-r">
        <ConversationSidebar />
      </aside>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  )
}
