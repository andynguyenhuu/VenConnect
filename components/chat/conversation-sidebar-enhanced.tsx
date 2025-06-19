'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Search, 
  MessageSquare,
  Clock,
  MoreVertical,
  Trash2,
  Edit2,
  Archive
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
    lastMessage: 'Docker container implementation discussion',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    messageCount: 24,
    model: 'claude-4-sonnet',
  },
  {
    id: '2',
    title: 'Vietnam Market Analysis',
    lastMessage: 'Market projections and adoption rates review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 18,
    model: 'claude-4-sonnet',
  },
  {
    id: '3',
    title: 'Code Review: Authentication',
    lastMessage: '2FA implementation for admin accounts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 42,
    model: 'claude-4-sonnet',
  },
  {
    id: '4',
    title: 'Database Schema Design',
    lastMessage: 'Schema optimization and indexing strategies',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    messageCount: 15,
    model: 'claude-4-sonnet',
  },
  {
    id: '5',
    title: 'API Documentation Review',
    lastMessage: 'Documentation enhancement and error handling',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    messageCount: 33,
    model: 'claude-4-sonnet',
  },
]

interface ConversationSidebarEnhancedProps {
  width?: 'narrow' | 'default' | 'wide'
  density?: 'compact' | 'comfortable' | 'spacious'
  viewMode?: 'list' | 'cards' | 'compact'
  selectedConversationId?: string
  onSelectConversation?: (id: string) => void
}

export function ConversationSidebarEnhanced({ 
  width = 'default', 
  density = 'comfortable',
  viewMode = 'list',
  selectedConversationId = '1',
  onSelectConversation
}: ConversationSidebarEnhancedProps = {}) {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedId, setSelectedId] = useState(selectedConversationId)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])
  const [bulkMode, setBulkMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group conversations by time
  const groupedConversations = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const groups = {
      today: [] as Conversation[],
      yesterday: [] as Conversation[],
      lastWeek: [] as Conversation[],
      older: [] as Conversation[]
    }
    
    filteredConversations.forEach(conv => {
      if (conv.timestamp >= today) {
        groups.today.push(conv)
      } else if (conv.timestamp >= yesterday) {
        groups.yesterday.push(conv)
      } else if (conv.timestamp >= lastWeek) {
        groups.lastWeek.push(conv)
      } else {
        groups.older.push(conv)
      }
    })
    
    
    return groups
  }

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
    onSelectConversation?.(newConv.id)
  }

  const handleDelete = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id))
    if (selectedId === id && conversations.length > 1) {
      setSelectedId(conversations[0].id)
    }
  }

  const handleBulkDelete = () => {
    setConversations(conversations.filter(c => !selectedConversations.includes(c.id)))
    setSelectedConversations([])
    setBulkMode(false)
  }

  const handleBulkArchive = () => {
    // In a real app, this would archive conversations
    console.log('Archiving conversations:', selectedConversations)
    setSelectedConversations([])
    setBulkMode(false)
  }

  const toggleConversationSelection = (id: string) => {
    if (selectedConversations.includes(id)) {
      setSelectedConversations(selectedConversations.filter(cId => cId !== id))
    } else {
      setSelectedConversations([...selectedConversations, id])
    }
  }

  // Dynamic width based on settings
  const getWidth = () => {
    switch (width) {
      case 'narrow': return "w-80"
      case 'wide': return "w-[28rem]"
      default: return "w-96"
    }
  }

  // Dynamic spacing based on density
  const getDensityClasses = () => {
    switch (density) {
      case 'compact': return {
        container: "space-y-1",
        item: "p-1.5",
        header: "p-2 space-y-2"
      }
      case 'spacious': return {
        container: "space-y-3",
        item: "p-3",
        header: "p-4 space-y-4"
      }
      default: return {
        container: "space-y-2",
        item: "p-2",
        header: "p-3 space-y-3"
      }
    }
  }

  const densityClasses = getDensityClasses()

  return (
    <div className={cn(
      "conversation-list flex flex-col h-full backdrop-blur-sm transition-all duration-200",
      getWidth()
    )}>
      {/* Header */}
      <div className={cn("border-b border-border/20 transition-theme", densityClasses.header)}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground/90">Conversations</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 justify-start text-sm h-9 font-medium interactive-element" 
            onClick={handleNewConversation}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 interactive-element"
            onClick={() => setBulkMode(!bulkMode)}
          >
            {bulkMode ? 'Done' : 'Select'}
          </Button>
        </div>
        
        {bulkMode && selectedConversations.length > 0 && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={handleBulkArchive}
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive ({selectedConversations.length})
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 h-8 text-xs"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete ({selectedConversations.length})
            </Button>
          </div>
        )}
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm h-9 interactive-element focus:border-primary"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className={cn("flex-1", density === 'compact' ? 'px-1' : 'px-2')}>
        <div className={cn("py-2", densityClasses.container)}>
          {filteredConversations.length === 0 && (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
            </div>
          )}
          
          {!searchQuery && (
            <>
              {Object.entries(groupedConversations()).map(([groupName, groupConversations]) => {
                if (groupConversations.length === 0) return null
                
                const groupLabels = {
                  today: 'Today',
                  yesterday: 'Yesterday', 
                  lastWeek: 'Last 7 days',
                  older: 'Older'
                }
                
                return (
                  <div key={groupName} className="conversation-group">
                    <div className="conversation-group-header px-3 py-2">
                      <h3 className="text-xs font-semibold text-high-contrast uppercase tracking-wider">
                        {groupLabels[groupName as keyof typeof groupLabels]}
                      </h3>
                    </div>
                    {groupConversations.map((conversation) => (
                      <ConversationItem 
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={selectedId === conversation.id}
                        bulkMode={bulkMode}
                        isChecked={selectedConversations.includes(conversation.id)}
                        density={density}
                        viewMode={viewMode}
                        onSelect={() => {
                          setSelectedId(conversation.id)
                          onSelectConversation?.(conversation.id)
                        }}
                        onToggleCheck={() => toggleConversationSelection(conversation.id)}
                        onDelete={() => handleDelete(conversation.id)}
                        mounted={mounted}
                      />
                    ))}
                  </div>
                )
              })}
            </>
          )}
          
          {searchQuery && (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <ConversationItem 
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedId === conversation.id}
                  bulkMode={bulkMode}
                  isChecked={selectedConversations.includes(conversation.id)}
                  density={density}
                  viewMode={viewMode}
                  onSelect={() => {
                    setSelectedId(conversation.id)
                    onSelectConversation?.(conversation.id)
                  }}
                  onToggleCheck={() => toggleConversationSelection(conversation.id)}
                  onDelete={() => handleDelete(conversation.id)}
                  mounted={mounted}
                />
              ))}
            </div>
          )}
          
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/20 bg-muted/20">
        <div className="text-xs text-muted-foreground/70 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-medium">Conversations</span>
            <span className="font-semibold text-foreground/80">{conversations.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  bulkMode: boolean
  isChecked: boolean
  density?: 'compact' | 'comfortable' | 'spacious'
  viewMode?: 'list' | 'cards' | 'compact'
  onSelect: () => void
  onToggleCheck: () => void
  onDelete: () => void
  mounted: boolean
}

function ConversationItem({ 
  conversation, 
  isSelected, 
  bulkMode, 
  isChecked, 
  density = 'comfortable',
  viewMode = 'list',
  onSelect, 
  onToggleCheck, 
  onDelete, 
  mounted 
}: ConversationItemProps) {
  
  // Dynamic padding based on density with consistent card heights
  const getPadding = () => {
    switch (density) {
      case 'compact': return 'p-3 min-h-[72px]'
      case 'spacious': return 'p-4 min-h-[96px]'
      default: return 'p-3 min-h-[88px]'
    }
  }

  // Standardized preview text function
  const getStandardizedPreview = (text: string) => {
    if (!text) return "No preview available"
    return text
  }

  // Card view for different view modes
  if (viewMode === 'cards') {
    return (
      <div className={cn(
        'conversation-item group relative border cursor-pointer transition-all duration-150',
        getPadding(),
        isSelected ? 'selected' : ''
      )}
      onClick={bulkMode ? onToggleCheck : onSelect}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {bulkMode && (
              <Checkbox checked={isChecked} onCheckedChange={onToggleCheck} className="w-4 h-4" />
            )}
            <div className="flex items-center gap-2 conversation-content">
              <MessageSquare className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
              <h4 className="conversation-title text-sm font-semibold">{conversation.title}</h4>
            </div>
            {!bulkMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Edit2 className="h-4 w-4 mr-2" />Rename</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="conversation-preview text-sm text-muted-foreground line-clamp-2 mb-2">
            {getStandardizedPreview(conversation.lastMessage)}
          </p>
          <div className="conversation-metadata flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>{conversation.messageCount} messages</span>
            <span>•</span>
            <Clock className="h-3 w-3" />
            <span>{mounted ? formatDistanceToNow(conversation.timestamp, { addSuffix: true }) : '...'}</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      className={cn(
        'conversation-item group relative cursor-pointer transition-all duration-150 touch-manipulation border',
        getPadding(),
        isSelected ? 'selected' : ''
      )}
      onClick={bulkMode ? onToggleCheck : onSelect}
    >
      <div className="flex items-start gap-2 w-full overflow-hidden min-w-0 max-w-full">
        {bulkMode && (
          <div className="flex items-center pt-1">
            <Checkbox
              checked={isChecked}
              onCheckedChange={onToggleCheck}
              className="w-4 h-4"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0 space-y-2 max-w-full overflow-hidden">
          {/* Main title row with clear hierarchy */}
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <MessageSquare className={cn(
                "h-4 w-4 flex-shrink-0 mt-0.5",
                isSelected ? "text-primary" : "text-muted-foreground/60"
              )} />
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "conversation-title text-sm font-semibold leading-tight",
                  isSelected ? "text-foreground" : "text-foreground/90"
                )}>
                  {conversation.title}
                </h4>
              </div>
            </div>
          </div>
          
          {/* Standardized preview text */}
          <div className="pl-7">
            <p className="conversation-preview text-sm text-muted-foreground line-clamp-2 mb-2">
              {getStandardizedPreview(conversation.lastMessage)}
            </p>
            {/* Single line metadata */}
            <div className="conversation-metadata flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span>{conversation.messageCount} messages</span>
              <span>•</span>
              <Clock className="h-3 w-3" />
              <span>{mounted ? formatDistanceToNow(conversation.timestamp, { addSuffix: true }) : '...'}</span>
            </div>
          </div>
        </div>
        
        {!bulkMode && (
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
                  onDelete()
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}