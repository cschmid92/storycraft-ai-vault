import React, { useState, useEffect } from 'react';
import { Send, User, Package, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Conversation, Message, BookForSaleStatus } from '../types/entities';
import { ConversationService } from '../services/conversationService';
import { useBooksForSale } from '../hooks/useBooksForSale';
import { useUserRatings } from '../hooks/useUserRatings';

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConversationId?: number;
}

const MessengerModal = ({ isOpen, onClose, selectedConversationId }: MessengerModalProps) => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  
  const { updateBookForSaleStatus } = useBooksForSale();
  const { rateBook } = useUserRatings();

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedConversationId) {
      setSelectedConversation(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      ConversationService.markMessagesAsSeen(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = () => {
    const conversationData = ConversationService.getConversations();
    setConversations(conversationData);
  };

  const loadMessages = (conversationId: number) => {
    const messageData = ConversationService.getMessagesForConversation(conversationId);
    setMessages(messageData);
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    ConversationService.addMessage(selectedConversation, 999, newMessage.trim());
    loadMessages(selectedConversation);
    loadConversations(); // Refresh to update last message
    setNewMessage('');
  };

  const handleStatusUpdate = (status: BookForSaleStatus) => {
    if (!selectedConversation || !currentConversation?.bookForSaleId) return;

    // Update status in conversation service
    ConversationService.updateBookStatus(selectedConversation, status, 999);
    
    // Update book for sale status
    updateBookForSaleStatus(currentConversation.bookForSaleId, status);
    
    // If marking as picked, show rating option
    if (status === 'Picked') {
      setShowRating(true);
    }
    
    loadMessages(selectedConversation);
    loadConversations();
  };

  const handleRatingSubmit = () => {
    if (!selectedConversation || !currentConversation?.bookForSale || rating === 0) return;

    // Submit rating
    const ratedUserId = currentConversation.user2Id === 999 ? currentConversation.user1Id : currentConversation.user2Id;
    ConversationService.submitRating(selectedConversation, 999, rating, ratedUserId);
    
    // Save rating to user ratings
    if (currentConversation.bookForSale.book) {
      rateBook(currentConversation.bookForSale.book.id, rating);
    }
    
    setShowRating(false);
    setRating(0);
    loadMessages(selectedConversation);
    loadConversations();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0 mx-4">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[calc(600px-80px)] md:flex-row flex-col">
          {/* Conversations List */}
          <div className="md:w-1/3 w-full border-r bg-slate-50 md:block hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Conversations</h3>
                <div className="space-y-2">
                  {conversations.map(conversation => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-white hover:bg-slate-100'
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={conversation.participantAvatar}
                          alt={conversation.participantName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-800 truncate">
                              {conversation.participantName}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatTime(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentConversation?.participantAvatar}
                        alt={currentConversation?.participantName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-slate-800">
                          {currentConversation?.participantName}
                        </h4>
                        {currentConversation?.bookForSale?.book && (
                          <p className="text-sm text-slate-600">
                            {currentConversation.bookForSale.book.title}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Controls */}
                    <div className="flex items-center gap-2">
                      {currentConversation?.status && (
                        <Badge variant={currentConversation.status === 'Available' ? 'secondary' : 
                                      currentConversation.status === 'Sold' ? 'default' : 'destructive'}>
                          {currentConversation.status}
                        </Badge>
                      )}
                      
                      {/* Status Update Buttons (only show if user is the buyer) */}
                      {currentConversation?.user1Id === 999 && (
                        <div className="flex gap-1">
                          {currentConversation?.status === 'Available' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate('Sold')}
                              className="text-xs"
                            >
                              <Package className="h-3 w-3 mr-1" />
                              Mark as Sold
                            </Button>
                          )}
                          {currentConversation?.status === 'Sold' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate('Picked')}
                              className="text-xs"
                            >
                              <Package className="h-3 w-3 mr-1" />
                              Mark as Picked
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === 'status_update' ? 'justify-center' : 
                          message.isFromMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.type === 'status_update' 
                              ? 'bg-green-100 text-green-800 text-center text-sm border border-green-200'
                            : message.type === 'rating_request'
                              ? 'bg-yellow-100 text-yellow-800 text-center text-sm border border-yellow-200'
                            : message.isFromMe
                              ? 'bg-blue-500 text-white max-w-xs lg:max-w-md'
                              : 'bg-slate-200 text-slate-800 max-w-xs lg:max-w-md'
                          }`}
                        >
                          {message.type === 'status_update' && (
                            <div className="flex items-center justify-center gap-2">
                              <Package className="h-4 w-4" />
                              <p>{message.content}</p>
                            </div>
                          )}
                          
                          {message.type === 'rating_request' && (
                            <div className="flex items-center justify-center gap-2">
                              <Star className="h-4 w-4" />
                              <p>{message.content}</p>
                            </div>
                          )}
                          
                          {!message.type || message.type === 'text' && (
                            <>
                              <p className="text-sm">{message.content}</p>
                              {message.metadata?.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < message.metadata.rating 
                                          ? 'fill-yellow-400 text-yellow-400' 
                                          : 'text-slate-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                          
                          <p className={`text-xs mt-1 ${
                            message.type === 'status_update' || message.type === 'rating_request'
                              ? 'text-slate-500'
                            : message.isFromMe ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Rating UI */}
                {showRating && (
                  <div className="p-4 border-t bg-blue-50">
                    <div className="text-center">
                      <h4 className="font-medium text-slate-800 mb-2">Rate your experience</h4>
                      <p className="text-sm text-slate-600 mb-3">How was your transaction?</p>
                      <div className="flex justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            onClick={() => setRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRating(false)}
                        >
                          Skip
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleRatingSubmit}
                          disabled={rating === 0}
                        >
                          Submit Rating
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center px-4">
                  <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
            
            {/* Mobile conversation list */}
            <div className="md:hidden w-full bg-slate-50 border-t">
              <ScrollArea className="h-32">
                <div className="p-2">
                  <div className="flex gap-2 overflow-x-auto">
                    {conversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className={`flex-shrink-0 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conversation.id
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-white hover:bg-slate-100'
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-center gap-2 w-32">
                          <img
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate text-xs">
                              {conversation.participantName}
                            </p>
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessengerModal;