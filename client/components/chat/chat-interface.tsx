"use client";

import React, { useRef, useEffect } from "react";
import { Bot, MessageSquare, AlertCircle, RotateCcw } from "lucide-react";

import { ChatMessageBubble } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useChatSession, useChatMessages, useSendMessage } from "@/hooks/use-chat";
import type { Repository } from "@/lib/api";

interface ChatInterfaceProps {
    repository: Repository;
}

export function ChatInterface({ repository }: ChatInterfaceProps) {
    const { data: session, isLoading: sessionLoading } = useChatSession(
        repository.id
    );
    const { data: messages, isLoading: messagesLoading } = useChatMessages(
        session?.id ?? ""
    );
    const sendMutation = useSendMessage(session?.id ?? "");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, sendMutation.isPending, sendMutation.isError]);

    if (sessionLoading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    const handleSend = (content: string) => {
        if (!session) return;
        sendMutation.mutate(content);
    };

    return (
        <div className="flex flex-1 flex-col h-full">
            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                {messagesLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Spinner className="size-6" />
                    </div>
                ) : messages && messages.length > 0 ? (
                    <div className="max-w-3xl mx-auto py-4 space-y-1">
                        {messages.map((msg) => (
                            <ChatMessageBubble key={msg.id} message={msg} />
                        ))}
                        {sendMutation.isPending && (
                            <div className="flex gap-3 px-4 py-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Bot className="size-4" />
                                </div>
                                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5">
                                    <Spinner className="size-4" />
                                    <span className="text-sm text-muted-foreground">
                                        Thinking...
                                    </span>
                                </div>
                            </div>
                        )}
                        {sendMutation.isError && (
                            <div className="flex gap-3 px-4 py-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                    <AlertCircle className="size-4" />
                                </div>
                                <div className="flex flex-col gap-2 rounded-2xl bg-destructive/5 border border-destructive/20 px-4 py-2.5">
                                    <span className="text-sm text-destructive">
                                        Failed to get a response. Please try again.
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-fit gap-1.5 text-xs"
                                        onClick={() => {
                                            // Retry with the last message content
                                            const lastUserMsg = [...(messages ?? [])]
                                                .reverse()
                                                .find((m) => m.role === "user");
                                            if (lastUserMsg) {
                                                sendMutation.mutate(lastUserMsg.content);
                                            }
                                        }}
                                    >
                                        <RotateCcw className="size-3" />
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                            <MessageSquare className="size-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            Chat with {repository.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Ask questions about the code, architecture, or anything
                            in this repository. The AI will use the indexed code as context.
                        </p>
                    </div>
                )}
            </div>

            {/* Input */}
            <ChatInput
                onSend={handleSend}
                isLoading={sendMutation.isPending}
                disabled={!session}
            />
        </div>
    );
}
