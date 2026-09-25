"use client";

import React from "react";
import Link from "next/link";
import {
    MessageSquare,
    Trash2,
    RefreshCw,
    ExternalLink,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FolderGit2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { LanguageIcon } from "@/components/icons/language-icon";
import { useRemoveRepo, useTriggerIndex } from "@/hooks/use-repositories";
import type { Repository as RepoType } from "@/lib/api";

function StatusBadge({ status }: { status: RepoType["indexStatus"] }) {
    switch (status) {
        case "PENDING":
            return (
                <Badge variant="secondary" className="gap-1">
                    <Clock className="size-3" />
                    Pending
                </Badge>
            );
        case "INDEXING":
            return (
                <Badge variant="secondary" className="gap-1 bg-blue-500/15 text-blue-700 dark:text-blue-400">
                    <Loader2 className="size-3 animate-spin" />
                    Indexing
                </Badge>
            );
        case "INDEXED":
            return (
                <Badge variant="secondary" className="gap-1 bg-green-500/15 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="size-3" />
                    Indexed
                </Badge>
            );
        case "FAILED":
            return (
                <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="size-3" />
                    Failed
                </Badge>
            );
    }
}

function RepoCard({ repo }: { repo: RepoType }) {
    const removeMutation = useRemoveRepo();
    const indexMutation = useTriggerIndex();

    const indexProgress =
        repo.filesTotal > 0
            ? Math.round((repo.filesProcessed / repo.filesTotal) * 100)
            : 0;

    return (
        <Card className="group relative transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <LanguageIcon
                                language={repo.language}
                                className="size-4 text-muted-foreground"
                            />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-sm font-semibold truncate">
                                {repo.name}
                            </CardTitle>
                            <CardDescription className="text-xs truncate">
                                {repo.owner}/{repo.name}
                            </CardDescription>
                        </div>
                    </div>
                    <StatusBadge status={repo.indexStatus} />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {repo.description}
                    </p>
                )}

                {repo.indexStatus === "INDEXING" && repo.filesTotal > 0 && (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {repo.filesProcessed}/{repo.filesTotal} files
                            </span>
                            <span>{indexProgress}%</span>
                        </div>
                        <Progress value={indexProgress} className="h-1.5" />
                    </div>
                )}

                {repo.indexStatus === "INDEXED" && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{repo.chunkCount} chunks</span>
                        <span>•</span>
                        <span>{repo.filesProcessed} files</span>
                    </div>
                )}

                {repo.indexStatus === "FAILED" && repo.errorMessage && (
                    <p className="text-xs text-destructive line-clamp-2">
                        {repo.errorMessage}
                    </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                    {repo.indexStatus === "INDEXED" ? (
                        <Button size="sm" variant="default" className="gap-1.5" render={<Link href={`/chat/${repo.id}`} />}>
                            <MessageSquare className="size-3.5" />
                            Chat
                        </Button>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            size="sm"
                                            variant="default"
                                            className="gap-1.5"
                                            onClick={() => indexMutation.mutate(repo.id)}
                                            disabled={
                                                repo.indexStatus === "INDEXING" ||
                                                indexMutation.isPending
                                            }
                                        />
                                    }
                                >
                                    <RefreshCw
                                        className={`size-3.5 ${
                                            repo.indexStatus === "INDEXING"
                                                ? "animate-spin"
                                                : ""
                                        }`}
                                    />
                                    {repo.indexStatus === "INDEXING"
                                        ? "Indexing..."
                                        : "Index"}
                                </TooltipTrigger>
                                <TooltipContent>
                                    Index this repository to enable AI chat
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {repo.indexStatus === "INDEXED" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => indexMutation.mutate(repo.id)}
                            disabled={indexMutation.isPending}
                        >
                            <RefreshCw className="size-3.5" />
                            Re-index
                        </Button>
                    )}

                    <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto"
                    >
                        <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
                            <ExternalLink className="size-3.5" />
                        </Button>
                    </a>

                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-destructive"
                                />
                            }
                        >
                            <Trash2 className="size-3.5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove repository?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove <strong>{repo.fullName}</strong> and
                                    delete all indexed data. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => removeMutation.mutate(repo.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Remove
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}

export function RepoList({ repos }: { repos: RepoType[] }) {
    if (repos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-muted mb-4">
                    <FolderGit2 className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No repositories yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Add a GitHub repository to get started. Once indexed, you can chat
                    with your code using AI.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
            ))}
        </div>
    );
}
