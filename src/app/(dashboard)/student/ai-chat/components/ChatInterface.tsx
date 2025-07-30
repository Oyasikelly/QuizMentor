'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Bot, User } from 'lucide-react';
import { ChatInputBar } from './ChatInputBar';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  status?: 'sending' | 'delivered' | 'error';
  fileName?: string;
}

function MessageBubble({ message }: { message: Message }) {
  const isAI = message.sender === 'ai';
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-2`}>
      {isAI && <Bot className="w-6 h-6 mr-2 text-primary" />}
      <div
        className={`rounded-lg px-4 py-2 max-w-xs shadow ${
          isAI
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {message.fileName ? (
          <div className="text-sm font-semibold">📎 {message.fileName}</div>
        ) : (
          <div className="text-sm whitespace-pre-line">{message.text}</div>
        )}
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
          {message.status === 'sending' && <span>Sending...</span>}
          {message.status === 'error' && (
            <span className="text-destructive">Error</span>
          )}
          <span>{message.timestamp}</span>
        </div>
      </div>
      {!isAI && <User className="w-6 h-6 ml-2 text-primary" />}
    </div>
  );
}

function TypingIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
      <Bot className="w-4 h-4 animate-bounce" /> AI is typing...
    </div>
  );
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI tutor. How can I help you today?',
      timestamp: '09:00',
    },
    {
      id: '2',
      sender: 'student',
      text: 'Can you explain photosynthesis?',
      timestamp: '09:01',
    },
    {
      id: '3',
      sender: 'ai',
      text: 'Of course! Photosynthesis is the process by which green plants convert sunlight into energy...',
      timestamp: '09:01',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
    };
    setMessages((msgs) => [...msgs, newMsg]);
    setInput('');
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' } : m
        )
      );
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          {
            id: Date.now().toString() + '-ai',
            sender: 'ai',
            text: 'Here is an explanation for: ' + newMsg.text,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
        setIsTyping(false);
      }, 1200);
    }, 800);
  };

  const handleFileUpload = (file: File) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: '',
      fileName: file.name,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
    };
    setMessages((msgs) => [...msgs, newMsg]);
    setIsTyping(true);
    // Simulate AI response to file
    setTimeout(() => {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' } : m
        )
      );
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          {
            id: Date.now().toString() + '-ai',
            sender: 'ai',
            text: `I've received your file "${file.name}" and will analyze it. (AI file processing coming soon!)`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
        setIsTyping(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-2 py-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <TypingIndicator show={isTyping} />
        <div ref={chatEndRef} />
      </div>
      <ChatInputBar
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onFileUpload={handleFileUpload}
        disabled={isTyping}
      />
    </div>
  );
}
