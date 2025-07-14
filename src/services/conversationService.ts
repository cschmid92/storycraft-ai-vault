import { Conversation, Message, BookForSale } from '../types/entities';
import { mockConversations, mockMessages, mockUsers } from '../data/mockData';

export class ConversationService {
  private static conversations: Conversation[] = [...mockConversations];
  private static messages: Message[] = [...mockMessages];

  static getConversations(): Conversation[] {
    // Enhance conversations with message data
    return this.conversations.map(conv => {
      const messages = this.getMessagesForConversation(conv.id);
      const lastMessage = messages[messages.length - 1];
      const unreadCount = messages.filter(m => !m.seen && !m.isFromMe).length;
      
      return {
        ...conv,
        lastMessage: lastMessage?.content || '',
        lastMessageTime: lastMessage?.createdAt || conv.updatedAt,
        unreadCount
      };
    });
  }

  static getMessagesForConversation(conversationId: number): Message[] {
    return this.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  static createConversation(bookForSale: BookForSale, initialMessage: string): Conversation {
    const seller = bookForSale.seller;
    if (!seller) throw new Error('Seller information is required');

    // Check if conversation already exists
    const existingConv = this.conversations.find(conv => 
      (conv.user1Id === 999 && conv.user2Id === seller.id && conv.bookId === bookForSale.bookId) ||
      (conv.user1Id === seller.id && conv.user2Id === 999 && conv.bookId === bookForSale.bookId)
    );

    if (existingConv) {
      // Add message to existing conversation
      this.addMessage(existingConv.id, 999, initialMessage);
      return existingConv;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: this.conversations.length + 1,
      user1Id: 999, // Current user
      user2Id: seller.id,
      bookId: bookForSale.bookId,
      updatedAt: new Date(),
      participantName: `${seller.firstName} ${seller.lastName}`,
      participantAvatar: seller.avatar,
      lastMessage: initialMessage,
      lastMessageTime: new Date(),
      unreadCount: 0
    };

    this.conversations.push(newConversation);

    // Add initial message
    this.addMessage(newConversation.id, 999, initialMessage);

    return newConversation;
  }

  static addMessage(conversationId: number, senderId: number, content: string): Message {
    const newMessage: Message = {
      id: this.messages.length + 1,
      conversationId,
      senderId,
      content,
      createdAt: new Date(),
      seen: false,
      senderName: senderId === 999 ? "You" : "Seller",
      isFromMe: senderId === 999
    };

    this.messages.push(newMessage);

    // Update conversation's lastMessageId and updatedAt
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.lastMessageId = newMessage.id;
      conversation.updatedAt = new Date();
    }

    return newMessage;
  }

  static markMessagesAsSeen(conversationId: number): void {
    this.messages
      .filter(m => m.conversationId === conversationId && !m.isFromMe)
      .forEach(m => m.seen = true);
  }
}