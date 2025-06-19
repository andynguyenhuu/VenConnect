'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import { 
  Send, 
  Paperclip, 
  StopCircle, 
  Copy, 
  RotateCcw,
  Bot,
  User,
  Loader2,
  MessageSquare,
  Menu,
  Search,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// Component to highlight search terms in text
function HighlightedText({ text, searchTerm }: { text: string; searchTerm: string }) {
  if (!searchTerm) return <span>{text}</span>
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-primary/10 dark:bg-primary/20 text-foreground px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  )
}

// Component to render markdown with search highlighting
function MarkdownWithHighlight({ content, searchTerm }: { content: string; searchTerm: string }) {
  if (!searchTerm) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match
            return isInline ? (
              <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-3 rounded-md overflow-x-auto my-2">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            )
          },
          h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-medium mt-2 mb-1 text-foreground">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-sm">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          p: ({ children }) => <p className="mb-2 last:mb-0 text-sm">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/30 pl-3 italic my-2 text-muted-foreground">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-border rounded-md">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 bg-muted font-medium text-left text-xs">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-xs">
              {children}
            </td>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  // For search highlighting, we need to process the markdown differently
  // First, let's create a simplified version that highlights in the raw content
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code: ({ className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '')
          const isInline = !match
          return isInline ? (
            <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
              <HighlightedText text={String(children)} searchTerm={searchTerm} />
            </code>
          ) : (
            <pre className="bg-muted p-3 rounded-md overflow-x-auto my-2">
              <code className={className} {...props}>
                <HighlightedText text={String(children)} searchTerm={searchTerm} />
              </code>
            </pre>
          )
        },
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mt-3 mb-2 text-foreground">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold mt-3 mb-2 text-foreground">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-medium mt-2 mb-1 text-foreground">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </h3>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-sm">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-sm">{children}</ol>,
        li: ({ children }) => (
          <li className="leading-relaxed">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </li>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 text-sm">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/30 pl-3 italic my-2 text-muted-foreground">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </em>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full border border-border rounded-md">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border px-3 py-2 bg-muted font-medium text-left text-xs">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-3 py-2 text-xs">
            <HighlightedText text={String(children)} searchTerm={searchTerm} />
          </td>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokens?: number
  cost?: number
}

interface ChatInterfaceProps {
  conversationId?: string
}

// Mock messages for the first conversation
const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hi Claude, I need help designing the architecture for our new VenConnect platform. We\'re building a chat interface that connects teams in Vietnam and Australia. What would be the best approach for handling real-time messaging, user authentication, and data synchronization across regions?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    tokens: 45,
    cost: 0.0014
  },
  {
    id: '2',
    role: 'assistant',
    content: `Great question! For a multi-region chat platform like VenConnect, I'd recommend a microservices architecture with the following key components:

## Real-time Messaging
- **WebSocket connections** with Socket.io or native WebSockets
- **Message broker** like Redis Pub/Sub or RabbitMQ for scaling
- **Connection pooling** to handle high concurrent users

## Regional Architecture
- **Multi-region deployment** with servers in both APAC regions
- **Edge locations** for reduced latency (CloudFlare or AWS CloudFront)
- **Data residency compliance** for Vietnam and Australia regulations

## Authentication & Security
- **JWT tokens** with refresh token rotation
- **OAuth 2.0** integration (Google, Microsoft, SSO)
- **Role-based access control** for enterprise features
- **End-to-end encryption** for sensitive conversations

## Database Strategy
- **Primary-replica setup** with read replicas in each region
- **Supabase** for real-time subscriptions and row-level security
- **Redis** for session management and caching
- **PostgreSQL** for persistent chat history and user data

Would you like me to dive deeper into any of these areas?`,
    timestamp: new Date(Date.now() - 1000 * 60 * 28),
    tokens: 187,
    cost: 0.0056
  },
  {
    id: '3',
    role: 'user',
    content: 'This looks great! Can you elaborate on the data synchronization strategy? How do we handle message ordering and consistency when users in Vietnam and Australia are chatting in real-time?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    tokens: 32,
    cost: 0.0010
  },
  {
    id: '4',
    role: 'assistant',
    content: `Excellent question! Message ordering and consistency across regions is crucial. Here's a robust approach:

## Message Ordering Strategy

### 1. **Vector Clocks / Lamport Timestamps**
\`\`\`typescript
interface Message {
  id: string
  content: string
  timestamp: Date
  vectorClock: Record<string, number>
  sequenceNumber: number
}
\`\`\`

### 2. **Primary Write Region**
- Designate one region as the **primary writer** (e.g., Singapore for APAC)
- All messages go through the primary region first
- Other regions receive ordered updates via replication

### 3. **Conflict Resolution**
- **Last-writer-wins** with server timestamps
- **Causal ordering** for message dependencies
- **Client-side optimistic updates** with rollback capability

## Implementation Pattern
\`\`\`
┌─ Vietnam Client ─┐    ┌─ Primary (SG) ─┐    ┌─ Australia Client ─┐
│   Send Message   │───▶│   Order & Store │───▶│   Receive Message  │
│   Optimistic UI  │    │   Broadcast     │    │   Update UI        │
└──────────────────┘    └─────────────────┘    └────────────────────┘
\`\`\`

### 4. **Consistency Guarantees**
- **Eventual consistency** for chat history
- **Strong consistency** for message ordering within conversations
- **Read-your-writes** consistency for the sender

Would you like me to show you the specific Supabase implementation for this?`,
    timestamp: new Date(Date.now() - 1000 * 60 * 22),
    tokens: 245,
    cost: 0.0074
  },
  {
    id: '5',
    role: 'user',
    content: 'Yes, please show me the Supabase implementation. Also, what about handling network partitions or temporary connectivity issues?',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    tokens: 28,
    cost: 0.0008
  },
  {
    id: '6',
    role: 'assistant',
    content: `Perfect! Here's the Supabase implementation with resilience patterns:

## Supabase Schema
\`\`\`sql
-- Messages table with ordering
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_order BIGSERIAL,
  vector_clock JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  region VARCHAR(10) DEFAULT 'primary'
);

-- Add index for fast ordering
CREATE INDEX idx_messages_conversation_order 
ON messages(conversation_id, message_order);
\`\`\`

## Real-time Implementation
\`\`\`typescript
// Subscribe to new messages
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: \`conversation_id=eq.\${conversationId}\`
  }, (payload) => {
    handleNewMessage(payload.new as Message)
  })
  .subscribe()

// Send message with ordering
async function sendMessage(content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: currentConversation.id,
      content,
      vector_clock: getNextVectorClock(),
      region: getCurrentRegion()
    })
    .select()
    .single()
}
\`\`\`

## Network Partition Handling

### 1. **Offline Queue**
\`\`\`typescript
class MessageQueue {
  private pendingMessages: Message[] = []
  
  async sendMessage(message: Message) {
    // Add to local queue first
    this.pendingMessages.push(message)
    
    try {
      await this.syncToServer(message)
      this.removePendingMessage(message.id)
    } catch (error) {
      // Keep in queue for retry
      this.scheduleRetry(message)
    }
  }
}
\`\`\`

### 2. **Connection Monitoring**
\`\`\`typescript
// Monitor connection status
const connectionMonitor = supabase
  .channel('heartbeat')
  .on('presence', { event: 'sync' }, () => {
    setConnectionStatus('online')
    flushPendingMessages()
  })
  .on('presence', { event: 'leave' }, () => {
    setConnectionStatus('offline')
  })
\`\`\`

### 3. **Conflict Resolution UI**
When conflicts occur, show users:
- ✅ **Sent successfully**
- ⏳ **Sending...** (in queue)
- ⚠️ **Failed to send** (with retry button)
- 🔄 **Syncing...** (resolving conflicts)

This ensures users always know the state of their messages!`,
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    tokens: 312,
    cost: 0.0094
  }
]

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  // Initialize with mock messages for the first conversation (id: '1')
  const [messages, setMessages] = useState<Message[]>(
    conversationId === '1' ? mockMessages : []
  )
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet')
  const [showConversations, setShowConversations] = useState(false)
  const [searchInChat, setSearchInChat] = useState('')
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messageRefs = useRef<(HTMLDivElement | null)[]>([])
  const { toast } = useToast()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsStreaming(true)

    try {
      // TODO: Implement actual API call to Replicate/Claude
      // Simulating streaming response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])

      // Simulate streaming
      const fullResponse = `I'm Claude, your AI assistant. I understand you're testing the VenConnect platform. This interface will connect to Claude 4 Sonnet via Replicate API for your teams in Vietnam and Australia. 

Key features include:
- Real-time streaming responses
- File upload support for PDFs, docs, and images
- Multi-region compliance
- Usage tracking in VND/AUD

How can I assist you today?`
      
      for (let i = 0; i < fullResponse.length; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: fullResponse.slice(0, i + 5) }
              : msg
          )
        )
      }

      // Update with final message including tokens and cost
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: fullResponse, tokens: 150, cost: 0.0045 }
            : msg
        )
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleStop = () => {
    setIsStreaming(false)
    setIsLoading(false)
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
    })
  }

  const handleRetry = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message && message.role === 'user') {
      setInput(message.content)
    }
  }

  return (
    <div className="chat-container flex flex-col h-full">
      {/* Header with Breadcrumbs and Search */}
      <div className="chat-header p-4 space-y-4">
        {/* Breadcrumbs and Context */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>VenConnect</span>
            <span>/</span>
            <span>Chat</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              {messages.length > 0 ? 'Active Conversation' : 'New Conversation'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              {messages.length} messages
            </Badge>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Online
            </Badge>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Sheet open={showConversations} onOpenChange={setShowConversations}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="xl:hidden"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Conversations
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="h-full">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold">Conversations</h2>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Conversation history will appear here when connected to backend.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-4-sonnet">Claude 4 Sonnet</SelectItem>
                <SelectItem value="claude-4-sonnet-20240620" disabled>
                  Claude 4 Sonnet (June 2024)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Options */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={messages.length > 0 ? "Search in this conversation..." : "Start a conversation to enable search"}
                value={searchInChat}
                onChange={(e) => {
                  setSearchInChat(e.target.value)
                  if (messages.length > 0 && e.target.value) {
                    // Simple search within current conversation
                    const results: number[] = []
                    messages.forEach((message, index) => {
                      if (message.content.toLowerCase().includes(e.target.value.toLowerCase())) {
                        results.push(index)
                      }
                    })
                    setSearchResults(results)
                    setCurrentSearchIndex(0)
                    
                    // Auto-scroll to first result
                    if (results.length > 0) {
                      setTimeout(() => {
                        const firstResultElement = messageRefs.current[results[0]]
                        if (firstResultElement) {
                          firstResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }, 100)
                    }
                  } else {
                    setSearchResults([])
                    setCurrentSearchIndex(0)
                  }
                }}
                disabled={messages.length === 0}
                className="pl-9 h-9 bg-background/50 border-border/40 disabled:opacity-60"
              />
              {searchResults.length > 0 && (
                <div className="absolute right-3 top-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <span>
                    {currentSearchIndex + 1} of {searchResults.length}
                  </span>
                  <div className="flex gap-0.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4"
                      onClick={() => {
                        const newIndex = currentSearchIndex > 0 ? currentSearchIndex - 1 : searchResults.length - 1
                        setCurrentSearchIndex(newIndex)
                        const element = messageRefs.current[searchResults[newIndex]]
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4"
                      onClick={() => {
                        const newIndex = currentSearchIndex < searchResults.length - 1 ? currentSearchIndex + 1 : 0
                        setCurrentSearchIndex(newIndex)
                        const element = messageRefs.current[searchResults[newIndex]]
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-2 md:p-4" ref={scrollAreaRef}>
        <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto px-4">
              <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-card to-muted/20 border-dashed border-2">
                <div className="mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                    Welcome to VenConnect
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    Start a conversation with Claude 4 Sonnet. Ask questions, brainstorm ideas, or get help with your projects.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left justify-start bg-background/50 hover:bg-background/80"
                    onClick={() => setInput("Help me analyze market opportunities in Vietnam")}
                  >
                    <div>
                      <div className="font-medium mb-1">Market Analysis</div>
                      <div className="text-xs text-muted-foreground">
                        Analyze Vietnam market opportunities
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left justify-start bg-background/50 hover:bg-background/80"
                    onClick={() => setInput("Review this code for security best practices")}
                  >
                    <div>
                      <div className="font-medium mb-1">Code Review</div>
                      <div className="text-xs text-muted-foreground">
                        Get security and performance feedback
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left justify-start bg-background/50 hover:bg-background/80"
                    onClick={() => setInput("Help me design a scalable architecture for")}
                  >
                    <div>
                      <div className="font-medium mb-1">Architecture Design</div>
                      <div className="text-xs text-muted-foreground">
                        Plan scalable system architecture
                      </div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 text-left justify-start bg-background/50 hover:bg-background/80"
                    onClick={() => setInput("Explain complex technical concepts in simple terms")}
                  >
                    <div>
                      <div className="font-medium mb-1">Technical Explanation</div>
                      <div className="text-xs text-muted-foreground">
                        Break down complex topics
                      </div>
                    </div>
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Claude 4 Sonnet Ready</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>200k Context Window</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>File Upload Supported</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              ref={(el) => { messageRefs.current[index] = el }}
              className={cn(
                'group px-2 md:px-0 mb-6',
                searchResults.includes(index) && searchInChat && (
                  searchResults[currentSearchIndex] === index
                    ? 'bg-primary/10 dark:bg-primary/20 rounded-lg p-2 border border-primary/30 dark:border-primary/40'
                    : 'bg-muted/50 dark:bg-muted/30 rounded-lg p-2 border border-muted/50 dark:border-muted/60'
                )
              )}
            >
              {message.role === 'user' ? (
                /* User Message - Right aligned with distinct styling */
                <div className="flex justify-end">
                  <div className="max-w-[80%] md:max-w-[70%]">
                    <div className="chat-message-user p-4 rounded-2xl shadow-sm transition-theme">
                      <div className="text-sm leading-relaxed text-primary-foreground">
                        <HighlightedText 
                          text={message.content} 
                          searchTerm={searchInChat}
                        />
                      </div>
                      {message.tokens && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-primary-foreground/70">
                          <span>{message.tokens} tokens</span>
                          <span>•</span>
                          <span>${message.cost?.toFixed(4)} AUD</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 md:h-8 md:w-8 hover:bg-background/10"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 md:h-8 md:w-8 hover:bg-background/10"
                        onClick={() => handleRetry(message.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* AI Response - Clean, no avatars or labels */
                <div className="max-w-none">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {message.content ? (
                      <div className="chat-markdown text-foreground leading-relaxed">
                        <MarkdownWithHighlight 
                          content={message.content} 
                          searchTerm={searchInChat}
                        />
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-24 md:w-32" />
                    )}
                  </div>
                  
                  {message.tokens && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <span>{message.tokens} tokens</span>
                      <span>•</span>
                      <span>${message.cost?.toFixed(4)} AUD</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 md:h-8 md:w-8 hover:bg-background/10"
                      onClick={() => handleCopy(message.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 rounded-full px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="font-medium">Thinking...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t transition-theme">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="hidden sm:flex flex-shrink-0"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="chat-input transition-theme min-h-[60px] max-h-[200px] pr-20 sm:pr-12 resize-none text-base"
                  disabled={isLoading}
                />
                
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="sm:hidden h-8 w-8"
                    disabled={isLoading}
                  >
                    <Paperclip className="h-3 w-3" />
                  </Button>
                  
                  {isStreaming ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={handleStop}
                    >
                      <StopCircle className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="hidden sm:inline">Powered by Claude 4 Sonnet</span>
                <span className="sm:hidden">Claude 4 Sonnet</span>
                {isLoading && (
                  <>
                    <span>•</span>
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </>
                )}
              </span>
              <span className="whitespace-nowrap">Max context: 200k tokens</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
