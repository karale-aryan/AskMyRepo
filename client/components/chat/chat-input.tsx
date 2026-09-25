"use client";

import React, { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        const trimmed = value.trim();
        if (!trimmed || isLoading || disabled) return;
        onSend(trimmed);
        setValue("");
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t bg-background p-4">
            <div className="relative mx-auto max-w-3xl">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about the code..."
                    className="min-h-[56px] max-h-[200px] resize-none pr-14 rounded-xl"
                    rows={1}
                    disabled={disabled}
                />
                <Button
                    size="sm"
                    className="absolute right-2 bottom-2 size-9 rounded-lg"
                    onClick={handleSubmit}
                    disabled={!value.trim() || isLoading || disabled}
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Send className="size-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
