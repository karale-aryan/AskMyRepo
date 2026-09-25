"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/api";

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex gap-3 px-4 py-3",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            {!isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="size-4" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                )}
            >
                {isUser ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:bg-background/50 prose-pre:rounded-lg prose-code:text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <User className="size-4" />
                </div>
            )}
        </div>
    );
}
