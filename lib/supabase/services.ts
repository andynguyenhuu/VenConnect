import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type Message = Tables['messages']['Row']
type Conversation = Tables['conversations']['Row']
type User = Tables['users']['Row']

export const conversationService = {
  async create(title: string, userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        title,
        user_id: userId,
        model_version: 'claude-4-sonnet',
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async list(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async get(conversationId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .eq('id', conversationId)
      .single()
    
    if (error) throw error
    return data
  },

  async update(conversationId: string, updates: Partial<Conversation>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async archive(conversationId: string) {
    return this.update(conversationId, { is_archived: true })
  },
}

export const messageService = {
  async create(message: {
    conversation_id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    tokens_used?: number
    cost_aud?: number
    cost_vnd?: number
    model_version?: string
  }) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async list(conversationId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Subscribe to new messages in real-time
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const supabase = createClient()
    
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as Message)
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  },
}

export const userService = {
  async getCurrentUser() {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getOrganisation(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_organisations')
      .select(`
        role,
        organisations (*)
      `)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },
}

export const usageService = {
  async trackApiCall(usage: {
    user_id: string
    organisation_id?: string
    endpoint: string
    method: string
    status_code: number
    response_time_ms: number
    tokens_used?: number
    cost_aud?: number
    cost_vnd?: number
    ip_address?: string
    user_agent?: string
  }) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('api_usage')
      .insert(usage)
    
    if (error) throw error
  },

  async getDailyUsage(userId: string, days: number = 7) {
    const supabase = createClient()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getUserStatistics(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Subscribe to real-time usage updates
  subscribeToUsage(userId: string, callback: (usage: any) => void) {
    const supabase = createClient()
    
    const channel = supabase
      .channel(`usage:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'api_usage',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new)
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  },
}

export const fileService = {
  async uploadAttachment(
    file: File,
    messageId: string,
    userId: string
  ) {
    const supabase = createClient()
    
    // Upload file to storage
    const fileName = `${userId}/${messageId}/${file.name}`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('attachments')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    // Save attachment record
    const { data, error } = await supabase
      .from('attachments')
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: uploadData.path,
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAttachmentUrl(storagePath: string) {
    const supabase = createClient()
    
    const { data } = supabase
      .storage
      .from('attachments')
      .getPublicUrl(storagePath)
    
    return data.publicUrl
  },

  async deleteAttachment(attachmentId: string, storagePath: string) {
    const supabase = createClient()
    
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('attachments')
      .remove([storagePath])
    
    if (storageError) throw storageError
    
    // Delete record
    const { error } = await supabase
      .from('attachments')
      .delete()
      .eq('id', attachmentId)
    
    if (error) throw error
  },
}
