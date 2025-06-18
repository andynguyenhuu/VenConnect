'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  MessageSquare,
  Clock,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  model: string
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Project Architecture Discussion',
    lastMessage: 'The microservices approach would be ideal for...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    messageCount: 24,
    model: 'claude-4-sonnet',
  },
  {
    id: '2',
    title: 'Vietnam Market Analysis',
    lastMessage: 'Based on the data, the Vietnamese market shows...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 18,
    model: 'claude-4-sonnet',
  },
  {
    id: '3',
    title: 'Code Review: Authentication',
    lastMessage: 'The Auth0 implementation looks good, but...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 42,
    model: 'claude-4-sonnet',
  },
]

export function ConversationSidebar() {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedId, setSelectedId] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0,
      model: 'claude-4-sonnet',
    }
    setConversations([newConv, ...conversations])
    setSelectedId(newConv.id)
  }

  const handleDelete = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id))
    if (selectedId === id && conversations.length > 1) {
      setSelectedId(conversations[0].id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Header */}
      <div className="p-4 space-y-4">
        <Button 
          className="w-full justify-start" 
          onClick={handleNewConversation}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                'group relative rounded-lg p-3 hover:bg-accent cursor-pointer transition-colors',
                selectedId === conversation.id && 'bg-accent'
              )}
              onClick={() => setSelectedId(conversation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <h4 className="text-sm font-medium truncate">
                      {conversation.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(conversation.timestamp, { addSuffix: true })}</span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {conversation.messageCount}
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(conversation.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total conversations</span>
            <span className="font-medium">{conversations.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Storage used</span>
            <span className="font-medium">124 MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
