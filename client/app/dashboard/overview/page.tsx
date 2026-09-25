"use client";

import { RequireAuth } from "@/components/provider/required-auth";
import { AppShell } from "@/components/layout/app-shell";
import { useRepositories } from "@/hooks/use-repositories";
import { useCurrentUser } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
    FolderGit2,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    ArrowRight,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LanguageIcon } from "@/components/icons/language-icon";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
}: {
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ElementType;
    iconClass?: string;
}) {
    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className={`size-4 ${iconClass ?? "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tabular-nums">{value}</div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}

function OverviewContent() {
    const { data: repos, isLoading } = useRepositories();
    const { data: user } = useCurrentUser();

    const stats = {
        total: repos?.length ?? 0,
        indexed: repos?.filter((r) => r.indexStatus === "INDEXED").length ?? 0,
        pending:
            repos?.filter(
                (r) => r.indexStatus === "PENDING" || r.indexStatus === "INDEXING"
            ).length ?? 0,
        failed: repos?.filter((r) => r.indexStatus === "FAILED").length ?? 0,
        totalChunks: repos?.reduce((sum, r) => sum + r.chunkCount, 0) ?? 0,
        totalFiles: repos?.reduce((sum, r) => sum + r.filesProcessed, 0) ?? 0,
    };

    const indexedRepos = repos?.filter((r) => r.indexStatus === "INDEXED") ?? [];

    return (
        <AppShell hideHeader>
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-sm font-semibold">Overview</h1>
                </div>
                <ModeToggle />
            </header>

            {isLoading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                    <Spinner className="size-6" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Welcome */}
                    <div>
                        <h2 className="font-heading text-2xl font-bold tracking-tight">
                            {user ? `Welcome, ${user.displayName?.split(" ")[0] ?? user.githubUsername}` : "Welcome"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {stats.total === 0
                                ? "Get started by adding a repository from the Repositories page."
                                : `You have ${stats.total} ${stats.total === 1 ? "repository" : "repositories"} connected${stats.indexed > 0 ? `, ${stats.indexed} ready to chat` : ""}.`}
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Repositories"
                            value={stats.total}
                            icon={FolderGit2}
                        />
                        <StatCard
                            title="Indexed"
                            value={stats.indexed}
                            subtitle={stats.totalChunks > 0 ? `${stats.totalChunks.toLocaleString()} code chunks across ${stats.totalFiles.toLocaleString()} files` : undefined}
                            icon={CheckCircle2}
                            iconClass="text-green-600 dark:text-green-400"
                        />
                        <StatCard
                            title="Pending"
                            value={stats.pending}
                            icon={Clock}
                        />
                        <StatCard
                            title="Failed"
                            value={stats.failed}
                            icon={AlertCircle}
                            iconClass={stats.failed > 0 ? "text-destructive" : undefined}
                        />
                    </div>

                    {/* Ready to chat */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Ready to chat</h3>
                            {indexedRepos.length > 0 && (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    All repositories
                                    <ArrowRight className="size-3" />
                                </Link>
                            )}
                        </div>
                        {indexedRepos.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                                <FolderGit2 className="size-8 text-muted-foreground/50 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">
                                    No indexed repositories yet. Add and index a repository to start chatting with your code.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {indexedRepos.map((repo) => (
                                    <Link
                                        key={repo.id}
                                        href={`/chat/${repo.id}`}
                                        className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md hover:shadow-primary/5"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                                            <MessageSquare className="size-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold truncate">
                                                    {repo.name}
                                                </p>
                                                {repo.language && (
                                                    <LanguageIcon
                                                        language={repo.language}
                                                        className="size-3.5 shrink-0 text-muted-foreground"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {repo.chunkCount > 0 ? `${repo.chunkCount} chunks` : `${repo.filesProcessed} files`}
                                                {repo.description ? ` · ${repo.description.slice(0, 40)}${repo.description.length > 40 ? "…" : ""}` : ""}
                                            </p>
                                        </div>
                                        <ArrowRight className="size-4 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppShell>
    );
}

export default function OverviewPage() {
    return (
        <RequireAuth>
            <OverviewContent />
        </RequireAuth>
    );
}
