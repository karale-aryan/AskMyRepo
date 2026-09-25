"use client";

import React, { useState } from "react";
import { Search, Plus, Lock, Globe } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LanguageIcon } from "@/components/icons/language-icon";
import { useGitHubRepos, useAddRepo } from "@/hooks/use-repositories";
import type { GitHubRepo } from "@/lib/api";

export function AddRepoDialog() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { data: repos, isLoading } = useGitHubRepos();
    const addMutation = useAddRepo();

    const filtered = repos?.filter(
        (repo) =>
            repo.name.toLowerCase().includes(search.toLowerCase()) ||
            repo.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async (repo: GitHubRepo) => {
        await addMutation.mutateAsync(repo.id);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="gap-2" />}>
                <Plus className="size-4" />
                Add Repository
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add a GitHub Repository</DialogTitle>
                    <DialogDescription>
                        Select a repository from your GitHub account to index and chat with.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search repositories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Spinner className="size-6" />
                        </div>
                    ) : filtered && filtered.length > 0 ? (
                        filtered.map((repo) => (
                            <button
                                key={repo.id}
                                onClick={() => handleAdd(repo)}
                                disabled={addMutation.isPending}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent disabled:opacity-50"
                            >
                                <LanguageIcon
                                    language={repo.language}
                                    className="size-4 shrink-0 text-muted-foreground"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium truncate">{repo.name}</span>
                                        {repo.isPrivate ? (
                                            <Lock className="size-3 text-muted-foreground" />
                                        ) : (
                                            <Globe className="size-3 text-muted-foreground" />
                                        )}
                                    </div>
                                    {repo.description && (
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {repo.description}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    {repo.owner.login}
                                </span>
                            </button>
                        ))
                    ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No repositories found.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
