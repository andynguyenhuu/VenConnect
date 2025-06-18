'use client'

import { useState, useEffect } from 'react'
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
  Edit2,
  ChevronLeft,
  ChevronRight
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
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className={cn(
      "flex flex-col h-full bg-card/50 backdrop-blur-sm border-l transition-all duration-200",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-3 space-y-3 border-b border-border/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="font-semibold text-sm text-foreground/90">Conversations</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-accent"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!isCollapsed && (
          <>
            <Button 
              className="w-full justify-start text-sm h-9 font-medium" 
              onClick={handleNewConversation}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm h-9 bg-background/50 border-border/40 focus:border-primary/50"
              />
            </div>
          </>
        )}
        {isCollapsed && (
          <Button 
            className="w-full justify-center" 
            onClick={handleNewConversation}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {filteredConversations.length === 0 && (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          )}
          
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                'group relative rounded-lg p-2 hover:bg-accent/70 cursor-pointer transition-all duration-150 touch-manipulation border',
                selectedId === conversation.id 
                  ? 'bg-primary/10 border-primary/20 shadow-sm' 
                  : 'bg-transparent border-transparent hover:border-border/30'
              )}
              onClick={() => setSelectedId(conversation.id)}
            >
              {isCollapsed ? (
                <div className="flex justify-center">
                  <MessageSquare className="h-5 w-5 text-foreground/70" />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1.5 overflow-hidden min-w-0">
                    <div className="flex items-start gap-2">
                      <MessageSquare className={cn(
                        "h-4 w-4 flex-shrink-0 mt-0.5",
                        selectedId === conversation.id ? "text-primary" : "text-muted-foreground/60"
                      )} />
                      <h4 className={cn(
                        "text-sm font-semibold truncate leading-tight",
                        selectedId === conversation.id ? "text-foreground" : "text-foreground/90"
                      )}>
                        {conversation.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground/80 truncate leading-relaxed pl-6">
                      {conversation.lastMessage.length > 60 
                        ? conversation.lastMessage.substring(0, 60) + '...' 
                        : conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between pl-6">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {mounted ? formatDistanceToNow(conversation.timestamp, { addSuffix: true }).replace('about ', '').replace(' ago', '') : '...'}
                        </span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground/80 font-medium"
                      >
                        {conversation.messageCount} msgs
                      </Badge>
                    </div>
                  </div>
                
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-accent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="text-sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive text-sm"
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
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border/20 bg-muted/20">
          <div className="text-xs text-muted-foreground/70 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-medium">Conversations</span>
              <span className="font-semibold text-foreground/80">{conversations.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
