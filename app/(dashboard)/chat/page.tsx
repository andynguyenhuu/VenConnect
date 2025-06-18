'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'
import { ConversationSidebarEnhanced } from '@/components/chat/conversation-sidebar-enhanced'

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState('1') // Default to first conversation

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversation History Sidebar - Only show on larger screens */}
      <aside className="hidden xl:flex w-72 border-r bg-muted/30 flex-shrink-0">
        <ConversationSidebarEnhanced 
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </aside>

      {/* Chat Interface */}
      <div className="flex-1 min-w-0 bg-background">
        <ChatInterface conversationId={selectedConversationId} />
      </div>
    </div>
  )
}
