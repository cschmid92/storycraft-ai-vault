import { Conversation, Message, BookForSale, Book, User } from '../types/entities';
import { mockConversations } from '../data/mockData';

// In-memory storage for conversations (simulating a database)
let conversations: Conversation[] = [...mockConversations];
let messageIdCounter = 100;
let conversationIdCounter = 10;

export const conversationService = {
  // Create a new conversation
  createConversation: (
    currentUserId: number,
    bookForSale: BookForSale,
    initialMessage: string
  ): Conversation => {
    if (!bookForSale.seller || !bookForSale.book) {
      throw new Error('BookForSale must include seller and book information');
    }

    // Check if conversation already exists between these users for this book
    const existingConversation = conversations.find(conv => 
      ((conv.user1Id === currentUserId && conv.user2Id === bookForSale.sellerId) ||
       (conv.user1Id === bookForSale.sellerId && conv.user2Id === currentUserId)) &&
      conv.bookId === bookForSale.bookId
    );

    if (existingConversation) {
      // Add the new message to existing conversation
      const newMessage: Message = {
        id: ++messageIdCounter,
        conversationId: existingConversation.id.toString(),
        senderId: currentUserId,
        content: initialMessage,
        createdAt: new Date(),
        seen: false
      };

      existingConversation.messages.push(newMessage);
      existingConversation.lastMessage = initialMessage;
      existingConversation.lastMessageTime = new Date();
      existingConversation.lastMessageId = newMessage.id;
      existingConversation.updatedAt = new Date();

      return existingConversation;
    }

    // Create new conversation
    const newMessage: Message = {
      id: ++messageIdCounter,
      conversationId: conversationIdCounter.toString(),
      senderId: currentUserId,
      content: initialMessage,
      createdAt: new Date(),
      seen: false
    };

    const newConversation: Conversation = {
      id: ++conversationIdCounter,
      user1Id: currentUserId,
      user2Id: bookForSale.sellerId,
      bookId: bookForSale.bookId,
      lastMessageId: newMessage.id,
      book: bookForSale.book,
      participant: bookForSale.seller,
      lastMessage: initialMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [newMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    conversations.push(newConversation);
    return newConversation;
  },

  // Get all conversations for a user
  getConversations: (userId: number): Conversation[] => {
    return conversations
      .filter(conv => conv.user1Id === userId || conv.user2Id === userId)
      .sort((a, b) => {
        const aTime = a.lastMessageTime?.getTime() || 0;
        const bTime = b.lastMessageTime?.getTime() || 0;
        return bTime - aTime;
      });
  },

  // Add a message to a conversation
  addMessage: (conversationId: number, senderId: number, content: string): Message => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: Message = {
      id: ++messageIdCounter,
      conversationId: conversationId.toString(),
      senderId,
      content,
      createdAt: new Date(),
      seen: false
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = content;
    conversation.lastMessageTime = new Date();
    conversation.lastMessageId = newMessage.id;
    conversation.updatedAt = new Date();

    return newMessage;
  },

  // Mark messages as seen
  markMessagesAsSeen: (conversationId: number, userId: number): void => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;

    conversation.messages.forEach(message => {
      if (message.senderId !== userId) {
        message.seen = true;
      }
    });

    // Update unread count
    conversation.unreadCount = conversation.messages.filter(
      msg => msg.senderId !== userId && !msg.seen
    ).length;
  }
};