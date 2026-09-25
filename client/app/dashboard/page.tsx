"use client";

import { RequireAuth } from "@/components/provider/required-auth";
import { AppShell } from "@/components/layout/app-shell";
import { RepoList } from "@/components/dashboard/repo-list";
import { AddRepoDialog } from "@/components/dashboard/add-repo-dialog";
import { useRepositories } from "@/hooks/use-repositories";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";

function DashboardContent() {
    const { data: repos, isLoading } = useRepositories();

    return (
        <AppShell hideHeader>
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-sm font-semibold">Repositories</h1>
                </div>
                <div className="flex items-center gap-2">
                    <AddRepoDialog />
                    <ModeToggle />
                </div>
            </header>

            {isLoading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                    <Spinner className="size-6" />
                </div>
            ) : (
                <RepoList repos={repos ?? []} />
            )}
        </AppShell>
    );
}

export default function DashboardPage() {
    return (
        <RequireAuth>
            <DashboardContent />
        </RequireAuth>
    );
}