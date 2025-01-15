// src/components/ChatComponents/ChatWindow.tsx
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface Participant {
  id: number;
  name: string;
  avatar?: string;
}

interface ChatWindowProps {
  chatId: number;
  onBack?: () => void;
}

export function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { ws, sendMessage, isConnected } = useWebSocket();
  const messageIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const fetchMessagesAndParticipant = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/chats/${chatId}/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        messageIds.current.clear();
        const sortedMessages = data.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const uniqueMessages = sortedMessages.filter(msg => !messageIds.current.has(msg.id));
        uniqueMessages.forEach(msg => messageIds.current.add(msg.id));
        setMessages(uniqueMessages);

        const chatResponse = await fetch(`http://localhost:3001/api/chats/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!chatResponse.ok) {
          throw new Error('Failed to fetch chat details');
        }

        const chatData = await chatResponse.json();
        const otherParticipant = chatData.participants.find((p: any) => p.id !== user?.id);
        
        if (otherParticipant) {
          setParticipant({
            id: otherParticipant.id,
            name: otherParticipant.name,
            avatar: otherParticipant.avatar
          });
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessagesAndParticipant();
  }, [chatId, user?.id]);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'NEW_MESSAGE':
          if (data.chatId === chatId && !messageIds.current.has(data.message.id)) {
            setMessages(prev => {
              const newMessages = [...prev, data.message];
              messageIds.current.add(data.message.id);
              return newMessages;
            });
          }
          break;
        case 'TYPING':
          if (data.chatId === chatId && data.userId !== user?.id) {
            setIsTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
          }
          break;
        case 'READ_RECEIPT':
          if (data.chatId === chatId) {
            setMessages(prev => prev.map(msg => 
              msg.id <= data.messageId ? { ...msg, read: true } : msg
            ));
          }
          break;
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => {
      ws.removeEventListener('message', handleMessage);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [ws, chatId, user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ws || !isConnected || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/chats/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId,
          content: newMessage.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      if (!messageIds.current.has(message.id)) {
        setMessages(prev => {
          const newMessages = [...prev, message];
          messageIds.current.add(message.id);
          return newMessages;
        });
      }

      sendMessage({
        type: 'NEW_MESSAGE',
        chatId,
        message
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setNewMessage('');
      setIsSubmitting(false);
    }
  };

  const handleTyping = () => {
    if (!ws || !isConnected || !user) return;
    sendMessage({ type: 'TYPING', chatId, userId: user.id });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {participant && (
        <ChatHeader
          participant={participant}
          isTyping={isTyping}
          onBack={onBack}
        />
      )}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        userId={user?.id}
      />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        onTyping={handleTyping}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileClear={handleFileClear}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}