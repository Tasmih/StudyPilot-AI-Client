import React from "react";
import { ChatInterface } from "@/features/tutor-chat/ChatInterface";

export default function AssistantPage() {
  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Tutor</h1>
        <p className="text-muted-foreground mt-1">
          Chat with your personalized AI tutor to resolve doubts and master concepts.
        </p>
      </div>
      
      {/* The ChatInterface component handles its own height constraints */}
      <ChatInterface />
    </div>
  );
}
