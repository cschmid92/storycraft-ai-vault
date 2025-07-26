import React, { useState, useEffect } from 'react';
import { Send, User, Package, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [ratingComment, setRatingComment] = useState('');
  
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
    ConversationService.submitRating(selectedConversation, 999, rating, ratedUserId, ratingComment.trim() || undefined);
    
    // Save rating to user ratings
    if (currentConversation.bookForSale.book) {
      rateBook(currentConversation.bookForSale.book.id, rating);
    }
    
    setShowRating(false);
    setRating(0);
    setRatingComment('');
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
      <DialogContent className="max-w-4xl h-[600px] md:h-[600px] h-[90vh] p-0 mx-2 md:mx-4">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b">
          <DialogTitle className="text-base md:text-lg">Messages</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[calc(90vh-60px)] md:h-[calc(600px-80px)] md:flex-row flex-col">
          {/* Conversations List - Desktop */}
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

          {/* Mobile Conversations List */}
          {!selectedConversation && (
            <div className="md:hidden w-full bg-slate-50">
              <ScrollArea className="h-full">
                <div className="p-3">
                  <h3 className="font-semibold text-slate-800 mb-3 text-center">Select a Conversation</h3>
                  <div className="space-y-2">
                    {conversations.map(conversation => (
                      <div
                        key={conversation.id}
                        className="p-3 rounded-lg cursor-pointer transition-colors bg-white hover:bg-slate-100 border"
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
                            {conversation.bookForSale?.book && (
                              <p className="text-xs text-slate-500 truncate">
                                {conversation.bookForSale.book.title}
                              </p>
                            )}
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
          )}

          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Mobile Back Button */}
                <div className="md:hidden p-2 border-b bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                    className="text-blue-600"
                  >
                    ← Back to Conversations
                  </Button>
                </div>

                {/* Conversation Header */}
                <div className="p-3 md:p-4 border-b bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <img
                        src={currentConversation?.participantAvatar}
                        alt={currentConversation?.participantName}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-slate-800 text-sm md:text-base">
                          {currentConversation?.participantName}
                        </h4>
                        {currentConversation?.bookForSale?.book && (
                          <p className="text-xs md:text-sm text-slate-600">
                            {currentConversation.bookForSale.book.title}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Controls */}
                    <div className="flex items-center gap-1 md:gap-2">
                      {currentConversation?.status && (
                        <Badge variant={currentConversation.status === 'Available' ? 'secondary' : 
                                      currentConversation.status === 'Sold' ? 'default' : 'destructive'}>
                          {currentConversation.status}
                        </Badge>
                      )}
                      
                      {/* Status Update Buttons (only show if user is the buyer) */}
                      {currentConversation?.user1Id === 999 && (
                        <div className="flex flex-col md:flex-row gap-1">
                          {currentConversation?.status === 'Available' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate('Sold')}
                              className="text-xs whitespace-nowrap"
                            >
                              <Package className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">Mark as </span>Sold
                            </Button>
                          )}
                          {currentConversation?.status === 'Sold' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate('Picked')}
                              className="text-xs whitespace-nowrap"
                            >
                              <Package className="h-3 w-3 md:mr-1" />
                              <span className="hidden md:inline">Mark as </span>Picked
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-2 md:p-4">
                  <div className="space-y-3 md:space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === 'status_update' ? 'justify-center' : 
                          message.isFromMe ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`px-3 md:px-4 py-2 rounded-lg ${
                            message.type === 'status_update' 
                              ? 'bg-green-100 text-green-800 text-center text-sm border border-green-200'
                            : message.type === 'rating_request'
                              ? 'bg-yellow-100 text-yellow-800 text-center text-sm border border-yellow-200'
                            : message.isFromMe
                              ? 'bg-blue-500 text-white max-w-[85%] md:max-w-xs lg:max-w-md'
                              : 'bg-slate-200 text-slate-800 max-w-[85%] md:max-w-xs lg:max-w-md'
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
                          
                          {(!message.type || message.type === 'text') && (
                            <>
                              <p className="text-sm">{message.content}</p>
                              {message.metadata?.rating && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-1 mb-1">
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
                                  {message.content && message.content !== `Rated ${message.metadata.rating} stars` && (
                                    <p className="text-xs text-slate-600 italic mt-1">
                                      "{message.content}"
                                    </p>
                                  )}
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
                  <div className="p-3 md:p-4 border-t bg-blue-50">
                    <div className="text-center">
                      <h4 className="font-medium text-slate-800 mb-2 text-sm md:text-base">Rate your experience</h4>
                      <p className="text-xs md:text-sm text-slate-600 mb-3">How was your transaction?</p>
                       <div className="flex justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            size="sm"
                            onClick={() => setRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`h-5 w-5 md:h-6 md:w-6 ${
                                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                              }`}
                            />
                          </Button>
                        ))}
                      </div>
                      <div className="mb-4">
                        <Textarea
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          placeholder="Add a comment about your experience (optional)..."
                          className="text-sm resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRating(false)}
                          className="text-xs md:text-sm"
                        >
                          Skip
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleRatingSubmit}
                          disabled={rating === 0}
                          className="text-xs md:text-sm"
                        >
                          Submit Rating
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-3 md:p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 text-sm md:text-base"
                    />
                    <Button onClick={handleSendMessage} size="sm" className="px-2 md:px-3">
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
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessengerModal;