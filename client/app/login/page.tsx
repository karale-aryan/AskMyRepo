"use client";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icons";
import { DevpilotIcon } from "@/components/icons/devpilot-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getGitHubLoginUrl } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/use-auth";

function LoginLoading() {
    return (
        <div className="flex min-h-svh items-center justify-center">
            <Spinner className="size-8" />
        </div>
    );
}

const LoginContent = () => {
    const params = useSearchParams();
    const router = useRouter();
    const error = params.get("error");
    const next = params.get("next") || "dashboard";
    const { data: user, isLoading } = useCurrentUser();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace(next.startsWith("/") ? next : "/dashboard");
        }
    }, [user, isLoading, next, router]);

    if (isLoading || user) {
        return <LoginLoading />;
    }

    return (
        <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
            {/* Background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(from_var(--primary)_l_c_h/0.08),transparent_70%)]" />

            <nav className="relative z-10 flex h-16 items-center justify-between px-6 md:px-10 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-2.5">
                    <DevpilotIcon className="size-7" />
                    <span className="font-heading text-lg font-semibold tracking-tight">
                        AskMyRepo
                    </span>
                </Link>
                <ModeToggle />
            </nav>

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16">
                <div className="w-full max-w-sm space-y-8">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h1 className="font-heading text-2xl font-bold tracking-tight">
                            Sign in to AskMyRepo
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Connect your GitHub account to start chatting with your repositories.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-xl shadow-foreground/5 p-6 space-y-5">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle />
                                <AlertTitle>Sign-in failed</AlertTitle>
                                <AlertDescription>
                                    Something went wrong. Please try again.
                                </AlertDescription>
                            </Alert>
                        )}

                        <a
                            href={getGitHubLoginUrl()}
                            className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                        >
                            <GitHubIcon className="size-5" />
                            Continue with GitHub
                        </a>

                        <div className="text-center">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                We only request read access to your repositories.
                                <br />
                                Your code stays in the pipeline — never stored raw.
                            </p>
                        </div>
                    </div>

                    {/* Back link */}
                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowRight className="size-3 rotate-180" />
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginContent />
        </Suspense>
    );
}
