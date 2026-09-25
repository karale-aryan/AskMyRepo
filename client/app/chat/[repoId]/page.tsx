"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { RequireAuth } from "@/components/provider/required-auth";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useRepository } from "@/hooks/use-repositories";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BrandMark } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { LanguageIcon } from "@/components/icons/language-icon";

function ChatPageContent() {
    const params = useParams();
    const router = useRouter();
    const repoId = params.repoId as string;
    const { data: repo, isLoading, isError } = useRepository(repoId);

    if (isLoading) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (isError || !repo) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-3">
                <p className="text-sm text-muted-foreground">Repository not found.</p>
                <Button variant="outline" render={<Link href="/dashboard" />}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    if (repo.indexStatus !== "INDEXED") {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-3">
                <p className="text-sm text-muted-foreground">
                    This repository hasn&apos;t been indexed yet. Please index it first.
                </p>
                <Button variant="outline" render={<Link href="/dashboard" />}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col bg-background">
            {/* Header */}
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => router.push("/dashboard")}
                    >
                        <ArrowLeft className="size-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>

                    <div className="hidden sm:block">
                        <BrandMark />
                    </div>

                    <div className="h-6 w-px bg-border hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <LanguageIcon
                            language={repo.language}
                            className="size-4 text-muted-foreground"
                        />
                        <span className="text-sm font-medium truncate max-w-[200px]">
                            {repo.fullName}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                            {repo.chunkCount} chunks
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="ghost" size="sm" className="gap-1.5">
                            <ExternalLink className="size-3.5" />
                            <span className="hidden sm:inline">GitHub</span>
                        </Button>
                    </a>
                    <ModeToggle />
                </div>
            </header>

            {/* Chat */}
            <ChatInterface repository={repo} />
        </div>
    );
}

export default function ChatPage() {
    return (
        <RequireAuth>
            <ChatPageContent />
        </RequireAuth>
    );
}
