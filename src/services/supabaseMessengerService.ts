import { supabase, DatabaseConversation, DatabaseMessage } from './supabase'
import { Conversation, Message } from '../types/entities'
import { RealtimeChannel } from '@supabase/supabase-js'

export class SupabaseMessengerService {
  private static channel: RealtimeChannel | null = null

  // Initialize real-time subscription for conversations and messages
  static subscribeToUpdates(
    onConversationUpdate: (conversation: Conversation) => void,
    onMessageUpdate: (message: Message) => void
  ) {
    this.channel = supabase
      .channel('messenger_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          const conversation = this.transformConversation(payload.new as DatabaseConversation)
          onConversationUpdate(conversation)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const message = this.transformMessage(payload.new as DatabaseMessage)
          onMessageUpdate(message)
        }
      )
      .subscribe()

    return this.channel
  }

  static unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  // Get conversations for current user with pagination
  static async getConversations(userId: string, limit = 20, offset = 0): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages!conversations_last_message_id_fkey(content, created_at),
        user_profiles!conversations_user1_id_fkey(first_name, last_name, avatar),
        user_profiles_user2!conversations_user2_id_fkey(first_name, last_name, avatar)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data?.map(conv => this.transformConversation(conv)) || []
  }

  // Get messages for a conversation with pagination
  static async getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user_profiles(first_name, last_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return data?.map(msg => this.transformMessage(msg)) || []
  }

  // Send a new message
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: 'text' | 'status_update' | 'rating_request' = 'text',
    metadata?: any
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        type,
        metadata,
        seen: false
      })
      .select(`
        *,
        user_profiles(first_name, last_name)
      `)
      .single()

    if (error) throw error

    // Update conversation's updated_at and last_message_id
    await supabase
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
        last_message_id: data.id
      })
      .eq('id', conversationId)

    return this.transformMessage(data)
  }

  // Create a new conversation
  static async createConversation(
    user1Id: string,
    user2Id: string,
    bookId?: number,
    bookForSaleId?: string,
    initialMessage?: string
  ): Promise<Conversation> {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .eq('book_id', bookId || null)
      .single()

    if (existing) {
      if (initialMessage) {
        await this.sendMessage(existing.id, user1Id, initialMessage)
      }
      return this.transformConversation(existing)
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        book_id: bookId,
        book_for_sale_id: bookForSaleId,
        status: 'Available'
      })
      .select(`
        *,
        user_profiles!conversations_user1_id_fkey(first_name, last_name, avatar),
        user_profiles_user2!conversations_user2_id_fkey(first_name, last_name, avatar)
      `)
      .single()

    if (error) throw error

    const conversation = this.transformConversation(data)

    // Send initial message if provided
    if (initialMessage) {
      await this.sendMessage(conversation.id.toString(), user1Id, initialMessage)
    }

    return conversation
  }

  // Mark messages as seen
  static async markMessagesAsSeen(conversationId: string, userId: string): Promise<void> {
    await supabase
      .from('messages')
      .update({ seen: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('seen', false)
  }

  // Update book status
  static async updateBookStatus(
    conversationId: string,
    status: 'Available' | 'Sold' | 'Picked',
    senderId: string
  ): Promise<Message> {
    // Update conversation status
    await supabase
      .from('conversations')
      .update({ status })
      .eq('id', conversationId)

    // Send status update message
    const statusMessage = status === 'Picked' ? 'Book marked as picked up' : `Book marked as ${status.toLowerCase()}`
    return this.sendMessage(conversationId, senderId, statusMessage, 'status_update', { status })
  }

  // Transform database conversation to app format
  private static transformConversation(dbConv: any): Conversation {
    const currentUserId = '11111111-1111-1111-1111-111111111111' // This should come from auth context
    const otherUser = dbConv.user1_id === currentUserId ? dbConv.user_profiles_user2 : dbConv.user_profiles
    
    return {
      id: parseInt(dbConv.id),
      user1Id: parseInt(dbConv.user1_id),
      user2Id: parseInt(dbConv.user2_id),
      bookId: dbConv.book_id,
      bookForSaleId: dbConv.book_for_sale_id,
      status: dbConv.status,
      updatedAt: new Date(dbConv.updated_at),
      lastMessageId: dbConv.last_message_id ? parseInt(dbConv.last_message_id) : undefined,
      participantName: otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Unknown User',
      participantAvatar: otherUser?.avatar,
      lastMessage: dbConv.messages?.content || '',
      lastMessageTime: dbConv.messages?.created_at ? new Date(dbConv.messages.created_at) : new Date(dbConv.updated_at),
      unreadCount: 0 // This would need a separate query to calculate
    }
  }

  // Transform database message to app format
  private static transformMessage(dbMsg: any): Message {
    const currentUserId = '11111111-1111-1111-1111-111111111111' // This should come from auth context
    
    return {
      id: parseInt(dbMsg.id),
      conversationId: parseInt(dbMsg.conversation_id),
      senderId: parseInt(dbMsg.sender_id),
      content: dbMsg.content,
      type: dbMsg.type,
      metadata: dbMsg.metadata,
      createdAt: new Date(dbMsg.created_at),
      seen: dbMsg.seen,
      senderName: dbMsg.user_profiles ? `${dbMsg.user_profiles.first_name} ${dbMsg.user_profiles.last_name}` : 'Unknown',
      isFromMe: dbMsg.sender_id === currentUserId
    }
  }
}