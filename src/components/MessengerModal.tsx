import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
  isFromMe: boolean;
}

interface Conversation {
  id: number;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

interface MessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessengerModal = ({ isOpen, onClose }: MessengerModalProps) => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      participantName: "Alice Johnson",
      participantAvatar: "https://images.unsplash.com/photo-1494790108755-2616b2e99b65?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Is the book still available?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 2,
      messages: [
        {
          id: 1,
          senderId: 1,
          senderName: "Alice Johnson",
          content: "Hi! I'm interested in your copy of '1984'. Is it still available?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          isFromMe: false
        },
        {
          id: 2,
          senderId: 999,
          senderName: "You",
          content: "Yes, it's still available! The condition is good and I'm asking $12.99.",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          isFromMe: true
        },
        {
          id: 3,
          senderId: 1,
          senderName: "Alice Johnson",
          content: "Is the book still available?",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isFromMe: false
        }
      ]
    },
    {
      id: 2,
      participantName: "Bob Smith",
      participantAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Great, I'll take it!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
      messages: [
        {
          id: 4,
          senderId: 2,
          senderName: "Bob Smith",
          content: "Hello! I saw your listing for 'The Hobbit'. Can you meet tomorrow?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          isFromMe: false
        },
        {
          id: 5,
          senderId: 999,
          senderName: "You",
          content: "Sure! How about 2 PM at the coffee shop on Main Street?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
          isFromMe: true
        },
        {
          id: 6,
          senderId: 2,
          senderName: "Bob Smith",
          content: "Great, I'll take it!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isFromMe: false
        }
      ]
    }
  ]);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now(),
      senderId: 999,
      senderName: "You",
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromMe: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.content,
          lastMessageTime: message.timestamp
        };
      }
      return conv;
    }));

    setNewMessage('');
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
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-[calc(600px-80px)]">
          {/* Conversations List */}
          <div className="w-1/3 border-r bg-slate-50">
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
                  <div className="flex items-center gap-3">
                    <img
                      src={currentConversation?.participantAvatar}
                      alt={currentConversation?.participantName}
                      className="w-8 h-8 rounded-full"
                    />
                    <h4 className="font-medium text-slate-800">
                      {currentConversation?.participantName}
                    </h4>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentConversation?.messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromMe
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isFromMe ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

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
                <div className="text-center">
                  <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-500">
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