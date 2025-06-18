'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { 
  Send, 
  Paperclip, 
  StopCircle, 
  Copy, 
  RotateCcw,
  Bot,
  User,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
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
    <div className="flex flex-col h-full">
      {/* Model Selector */}
      <div className="p-4 border-b flex items-center justify-between">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claude-4-sonnet">Claude 4 Sonnet</SelectItem>
            <SelectItem value="claude-4-sonnet-20240620" disabled>
              Claude 4 Sonnet (June 2024)
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">
          {messages.length} messages
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <Card className="p-8 text-center">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground">
                Send a message to begin chatting with Claude 4 Sonnet
              </p>
            </Card>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'assistant' && 'flex-row-reverse'
              )}
            >
              <Avatar>
                <AvatarFallback>
                  {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                'flex-1 space-y-2',
                message.role === 'assistant' && 'items-end'
              )}>
                <Card className={cn(
                  'p-4',
                  message.role === 'user' ? 'bg-primary/5' : 'bg-secondary/5'
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content || <Skeleton className="h-4 w-32" />}
                  </div>
                  
                  {message.tokens && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{message.tokens} tokens</span>
                      <span>•</span>
                      <span>${message.cost?.toFixed(4)} AUD</span>
                    </div>
                  )}
                </Card>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {message.role === 'user' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRetry(message.id)}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Claude is thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
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
                className="min-h-[60px] max-h-[200px] pr-12 resize-none"
                disabled={isLoading}
              />
              
              {isStreaming ? (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute bottom-2 right-2"
                  onClick={handleStop}
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-2 right-2"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Claude 4 Sonnet via Replicate API</span>
            <span>Max context: 200k tokens</span>
          </div>
        </div>
      </form>
    </div>
  )
}
