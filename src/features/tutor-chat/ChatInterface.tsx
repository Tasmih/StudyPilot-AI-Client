"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, MoreHorizontal, FileText, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Explain quantum computing simply.",
  "Help me practice for my history exam.",
  "Summarize the key points of photosynthesis.",
  "How do I solve a quadratic equation?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your StudyPilot AI Tutor. What would you like to learn today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, presetMessage?: string) => {
    e?.preventDefault();
    const text = presetMessage || inputValue;
    if (!text.trim() && !presetMessage) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `This is a simulated response to: "${text}". In the final version, this will stream from the Gemini AI backend, providing rich, contextual tutoring assistance based on your study plan.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col overflow-hidden rounded-xl border bg-card shadow-lg md:flex-row">
      
      {/* Conversation History Sidebar (Hidden on mobile by default) */}
      <div className="hidden w-64 flex-col border-r bg-muted/30 md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-semibold">Recent Chats</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Mock history items */}
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              className="mb-1 w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 truncate text-muted-foreground">
                {i === 1 ? "Calculus Review" : i === 2 ? "History Essay Outline" : "Biology Chapter 4"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-3xl space-y-6 pb-20">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex max-w-[85%] gap-4",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    
                    {/* Avatar */}
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}>
                      {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-muted text-foreground rounded-tl-sm border"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full justify-start"
              >
                <div className="flex max-w-[85%] gap-4 flex-row">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border bg-muted px-4 py-4 shadow-sm">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="h-2 w-2 rounded-full bg-secondary"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="h-2 w-2 rounded-full bg-secondary"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className="h-2 w-2 rounded-full bg-secondary"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card to-transparent pt-10">
          <div className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
            
            {/* Suggested Prompts */}
            {messages.length === 1 && !isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex flex-wrap gap-2 justify-center"
              >
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(undefined, prompt)}
                    className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Sparkles className="h-3 w-3 text-accent" />
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}

            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-center overflow-hidden rounded-full border bg-background shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ring-offset-background"
            >
              <button type="button" className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="h-5 w-5" />
              </button>
              <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ImageIcon className="h-5 w-5" />
              </button>
              
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message StudyPilot AI..."
                className="border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
              />
              
              <Button 
                type="submit" 
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="mr-1 h-10 w-10 shrink-0 rounded-full bg-primary transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              StudyPilot AI can make mistakes. Consider verifying critical study information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Temporary icon component for mock history
function MessageSquareIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
