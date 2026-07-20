"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Plus,
  Trash2,
  Menu,
  X,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { apiClient } from "@/lib/api-client";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-toastify";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  createdAt: string | Date;
}

interface Conversation {
  _id: string;
  title: string;
  updatedAt?: string;
  messages: Message[];
}

const SUGGESTED_PROMPTS = [
  "Help me create a study schedule",
  "Explain my current study plan",
  "Quiz me on my weak topics",
  "What should I study today?",
];

// Helper to render basic Markdown rules like code blocks, inline code, and bold text without external packages.
function renderMessageContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).trim();
      const lines = code.split("\n");
      const language = lines[0] && lines[0].length < 15 ? lines[0] : "";
      const actualCode = language ? lines.slice(1).join("\n") : code;

      return (
        <pre
          key={i}
          className="my-2 overflow-x-auto rounded-lg bg-black/30 p-3.5 text-xs font-mono text-foreground border border-border/10 max-w-full"
        >
          {language && (
            <div className="text-[10px] text-muted-foreground uppercase mb-1.5 font-sans font-semibold">
              {language}
            </div>
          )}
          <code className="block select-text whitespace-pre">{actualCode}</code>
        </pre>
      );
    }

    const inlineParts = part.split(/(\*\*.*?\*\*|`.*?`)/g);
    return (
      <span key={i} className="whitespace-pre-wrap break-words">
        {inlineParts.map((subPart, j) => {
          if (subPart.startsWith("**") && subPart.endsWith("**")) {
            return (
              <strong key={j} className="font-semibold text-foreground">
                {subPart.slice(2, -2)}
              </strong>
            );
          }
          if (subPart.startsWith("`") && subPart.endsWith("`")) {
            return (
              <code
                key={j}
                className="bg-black/10 text-destructive dark:bg-white/10 dark:text-accent px-1.5 py-0.5 rounded text-xs font-mono font-medium"
              >
                {subPart.slice(1, -1)}
              </code>
            );
          }
          return subPart;
        })}
      </span>
    );
  });
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (autoSelectFirst = false) => {
    try {
      setIsLoadingConversations(true);
      setErrorState(null);
      const res = await apiClient.get<{ success: boolean; data: Conversation[] }>(
        "/api/ai/conversations"
      );
      if (res.success) {
        setConversations(res.data);
        if (autoSelectFirst && res.data.length > 0) {
          handleSelectConversation(res.data[0]._id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorState(err.message || "Failed to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSelectConversation = async (id: string) => {
    setActiveId(id);
    setIsSidebarOpen(false); // close side drawer on mobile
    setIsLoadingMessages(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: Conversation }>(
        `/api/ai/conversations/${id}`
      );
      if (res.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendPromptDirectly = async (convId: string, text: string) => {
    setIsTyping(true);

    const tempUserMsgId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempUserMsgId,
      sender: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await apiClient.post<{
        success: boolean;
        userMessage: Message;
        aiMessage: Message;
      }>(`/api/ai/conversations/${convId}/messages`, { content: text });

      if (res.success) {
        setMessages((prev) =>
          prev
            .map((m) => (m.id === tempUserMsgId ? res.userMessage : m))
            .concat(res.aiMessage)
        );
        await fetchConversations();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to fetch response from AI Tutor");
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsgId));
    } finally {
      setIsTyping(false);
    }
  };

  const handleCreateConversation = async (initialPrompt?: string) => {
    try {
      const defaultTitle = `Chat - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
      const res = await apiClient.post<{ success: boolean; data: Conversation }>(
        "/api/ai/conversations",
        {
          title: defaultTitle,
        }
      );
      if (res.success) {
        const newConv = res.data;
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(newConv._id);
        setMessages([]);

        if (initialPrompt) {
          await sendPromptDirectly(newConv._id, initialPrompt);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create conversation");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setInputValue("");

    if (!activeId) {
      await handleCreateConversation(text);
    } else {
      await sendPromptDirectly(activeId, text);
    }
  };

  const handleSelectSuggestedPrompt = async (promptText: string) => {
    if (!activeId) {
      await handleCreateConversation(promptText);
    } else {
      await sendPromptDirectly(activeId, promptText);
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const res = await apiClient.delete<{ success: boolean }>(
        `/api/ai/conversations/${id}`
      );
      if (res.success) {
        toast.success("Conversation deleted successfully");
        const updated = conversations.filter((c) => c._id !== id);
        setConversations(updated);

        if (activeId === id) {
          if (updated.length > 0) {
            handleSelectConversation(updated[0]._id);
          } else {
            setActiveId(null);
            setMessages([]);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete conversation");
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] w-full overflow-hidden rounded-xl border bg-card shadow-lg relative">
      
      {/* Mobile Drawer Overlay Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-card border-r z-50 flex flex-col h-full transition-transform duration-300 md:translate-x-0 md:static md:z-auto md:w-64 shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 shrink-0">
          <span className="font-semibold tracking-tight text-foreground">Recent Chats</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCreateConversation()}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs"
              title="Create New Conversation"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New</span>
            </Button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground md:hidden focus:outline-none"
              title="Close Menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 select-none">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No recent chats. Ask a question to start.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={cn(
                  "group relative flex items-center justify-between rounded-lg transition-colors",
                  activeId === conv._id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <button
                  onClick={() => handleSelectConversation(conv._id)}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 text-left text-sm truncate"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <span className="truncate pr-8">{conv.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(conv._id);
                  }}
                  className="absolute right-2 p-1.5 hover:bg-background rounded text-muted-foreground hover:text-destructive transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete Conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">
        
        {/* Chat Panel Header */}
        <div className="flex h-14 items-center gap-3 border-b bg-card px-4 shrink-0 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 hover:bg-muted rounded md:hidden text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            title="Open Conversations"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 truncate">
            {activeId ? (
              <h2 className="font-semibold text-foreground text-sm md:text-base truncate">
                {conversations.find((c) => c._id === activeId)?.title || "StudyPilot AI Chat"}
              </h2>
            ) : (
              <h2 className="font-semibold text-foreground text-sm md:text-base">
                StudyPilot AI Tutor
              </h2>
            )}
          </div>
        </div>

        {/* Message scroll viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6 pb-28">
            
            {errorState && (
              <Card className="border-destructive/30 bg-destructive/10 p-4 text-center">
                <p className="text-sm text-destructive font-medium mb-2">{errorState}</p>
                <Button size="sm" variant="outline" onClick={() => fetchConversations(true)}>
                  Retry Connection
                </Button>
              </Card>
            )}

            {isLoadingMessages ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading chat history...</span>
              </div>
            ) : !activeId ? (
              /* Welcome Splash state */
              <div className="text-center py-10 space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-8 w-8 animate-bounce" />
                </div>
                <div className="space-y-2 px-4">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Meet your StudyPilot AI Tutor
                  </h3>
                  <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
                    Ask academic questions, resolve doubts, or generate practice quizzes. Your AI Tutor is <strong>directly connected to your MongoDB study plans</strong>, dynamically reading your active task checklists and progress updates in real-time to contextualize its responses.
                  </p>
                </div>
                <div className="pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Suggested Topics
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-w-xl mx-auto px-4">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSuggestedPrompt(prompt)}
                        className="flex items-center gap-2 rounded-xl border bg-card p-3.5 text-left text-xs font-medium text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground hover:border-primary/40 active:scale-98"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              /* Empty Conversation state */
              <div className="text-center py-16 space-y-4">
                <Bot className="h-10 w-10 mx-auto text-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  No messages here yet. Ask a question or click a prompt below to start.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto pt-4 px-4">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSuggestedPrompt(prompt)}
                      className="flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Sparkles className="h-3 w-3 text-secondary" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Messages list */
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex w-full",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex max-w-[85%] gap-2.5 items-start",
                        msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm text-white",
                          msg.sender === "user" ? "bg-primary" : "bg-secondary"
                        )}
                      >
                        {msg.sender === "user" ? (
                          <User className="h-4.5 w-4.5" />
                        ) : (
                          <Bot className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <div className="space-y-1 max-w-full">
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted/40 text-foreground border rounded-tl-sm"
                          )}
                        >
                          {renderMessageContent(msg.content)}
                        </div>
                        <div
                          className={cn(
                            "text-[10px] text-muted-foreground/80 px-1",
                            msg.sender === "user" ? "text-right" : "text-left"
                          )}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Typing status */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full justify-start"
              >
                <div className="flex max-w-[85%] gap-2.5 items-start flex-row">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-white shadow-sm">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border bg-muted/30 px-4 py-3.5 shadow-sm">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="h-2 w-2 rounded-full bg-secondary/80"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="h-2 w-2 rounded-full bg-secondary/80"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className="h-2 w-2 rounded-full bg-secondary/80"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* User prompt typing panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card to-transparent pt-8 pb-4 shrink-0 z-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-end overflow-hidden rounded-2xl border bg-background shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ring-offset-background p-2 pr-3"
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  activeId
                    ? "Message StudyPilot AI..."
                    : "Ask a prompt to start a new chat..."
                }
                className="flex-1 min-h-[44px] max-h-[160px] resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0 outline-none text-foreground"
                rows={1}
                disabled={isTyping}
              />

              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="h-9 w-9 shrink-0 rounded-xl bg-primary transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 mb-1"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send Message</span>
              </Button>
            </form>
            <div className="mt-2 text-center text-[10px] text-muted-foreground">
              StudyPilot AI Tutor references your study tasks to optimize guidance.
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This will permanently erase the chat history."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConversation}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
