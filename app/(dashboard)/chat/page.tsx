'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'
import { ConversationSidebarEnhanced } from '@/components/chat/conversation-sidebar-enhanced'

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState('1') // Default to first conversation

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conversation History Sidebar - Only show on larger screens */}
      <aside className="hidden xl:flex w-[28rem] border-r bg-muted/30 flex-shrink-0">
        <ConversationSidebarEnhanced 
          width="wide"
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </aside>

      {/* Chat Interface */}
      <div className="flex-1 min-w-0 bg-background h-full">
        <ChatInterface conversationId={selectedConversationId} />
      </div>
    </div>
  )
}
