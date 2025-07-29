import { useState, useEffect, useCallback } from 'react'
import { Conversation, Message } from '../types/entities'
import { SupabaseMessengerService } from '../services/supabaseMessengerService'
import { useToast } from './use-toast'

export const useMessenger = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({})
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const { toast } = useToast()

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [userId])

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = SupabaseMessengerService.subscribeToUpdates(
      (updatedConversation) => {
        setConversations(prev => {
          const index = prev.findIndex(c => c.id === updatedConversation.id)
          if (index >= 0) {
            const newConversations = [...prev]
            newConversations[index] = updatedConversation
            return newConversations
          } else {
            return [updatedConversation, ...prev]
          }
        })
      },
      (newMessage) => {
        setMessages(prev => ({
          ...prev,
          [newMessage.conversationId]: [
            ...(prev[newMessage.conversationId] || []),
            newMessage
          ]
        }))

        // Show toast for new messages from others
        if (!newMessage.isFromMe) {
          toast({
            title: "New Message",
            description: `${newMessage.senderName}: ${newMessage.content.substring(0, 50)}${newMessage.content.length > 50 ? '...' : ''}`,
          })
        }
      }
    )

    return () => {
      SupabaseMessengerService.unsubscribe()
    }
  }, [toast])

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await SupabaseMessengerService.getConversations(userId)
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [userId, toast])

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      if (!messages[conversationId]) {
        const data = await SupabaseMessengerService.getMessages(conversationId)
        setMessages(prev => ({
          ...prev,
          [conversationId]: data
        }))
      }
      
      // Mark messages as seen
      await SupabaseMessengerService.markMessagesAsSeen(conversationId, userId)
      
      // Update conversation unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id.toString() === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Failed to load messages:', error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      })
    }
  }, [messages, userId, toast])

  const sendMessage = useCallback(async (
    conversationId: string, 
    content: string, 
    type: 'text' | 'status_update' | 'rating_request' = 'text',
    metadata?: any
  ) => {
    try {
      setSendingMessage(true)
      await SupabaseMessengerService.sendMessage(conversationId, userId, content, type, metadata)
    } catch (error) {
      console.error('Failed to send message:', error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setSendingMessage(false)
    }
  }, [userId, toast])

  const createConversation = useCallback(async (
    otherUserId: string,
    bookId?: number,
    bookForSaleId?: string,
    initialMessage?: string
  ) => {
    try {
      const conversation = await SupabaseMessengerService.createConversation(
        userId,
        otherUserId,
        bookId,
        bookForSaleId,
        initialMessage
      )
      
      // Add to conversations if not already there
      setConversations(prev => {
        const exists = prev.find(c => c.id === conversation.id)
        if (!exists) {
          return [conversation, ...prev]
        }
        return prev
      })
      
      return conversation
    } catch (error) {
      console.error('Failed to create conversation:', error)
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      })
      throw error
    }
  }, [userId, toast])

  const updateBookStatus = useCallback(async (
    conversationId: string,
    status: 'Available' | 'Sold' | 'Picked'
  ) => {
    try {
      await SupabaseMessengerService.updateBookStatus(conversationId, status, userId)
      
      // Update local conversation status
      setConversations(prev => 
        prev.map(conv => 
          conv.id.toString() === conversationId 
            ? { ...conv, status }
            : conv
        )
      )
    } catch (error) {
      console.error('Failed to update book status:', error)
      toast({
        title: "Error",
        description: "Failed to update book status",
        variant: "destructive"
      })
    }
  }, [userId, toast])

  return {
    conversations,
    messages,
    loading,
    sendingMessage,
    loadMessages,
    sendMessage,
    createConversation,
    updateBookStatus,
    refreshConversations: loadConversations
  }
}