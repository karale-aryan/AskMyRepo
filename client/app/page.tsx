"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    GitBranch,
    MessageSquare,
    Zap,
    Shield,
    Code2,
    Lock,
    EyeOff,
    Trash2,
    ShieldCheck,
    ChevronDown,
    ExternalLink,
    Server,
    Sparkles,
    Star,
    CheckCircle2,
    Layers,
    Search,
    Database,
    Cpu,
    Boxes,
    FileCheck2,
    KeySquare,
    FolderGit2
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/github-icons";
import { DevpilotIcon } from "@/components/icons/devpilot-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import { getGitHubLoginUrl } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/use-auth";
import { Hero3DVectorGraph } from "@/components/landing/Hero3DVectorGraph";
import { ProductShowcaseTabs } from "@/components/landing/ProductShowcaseTabs";
import { UserAvatar } from "@/components/ui/user-avatar";

/* ─────────────────────────────────────────────
   FAQ Accordion Item with active state & toggle icon
   ───────────────────────────────────────────── */
function FaqItem({
    question,
    answer,
    defaultOpen = false,
}: {
    question: string;
    answer: string;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
        <div className={cn(
            "rounded-xl border transition-all duration-200 overflow-hidden",
            open
                ? "border-orange-500/40 bg-card shadow-sm ring-1 ring-orange-500/20"
                : "border-border/60 bg-card/40 hover:bg-card/80 hover:border-border"
        )}>
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left text-sm sm:text-base font-semibold transition-colors"
                aria-expanded={open}
            >
                <span className={cn(open ? "text-foreground font-bold" : "text-foreground/90")}>
                    {question}
                </span>
                <span className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-mono transition-transform duration-200",
                    open
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-border text-muted-foreground bg-muted"
                )}>
                    {open ? "−" : "+"}
                </span>
            </button>
            <div
                className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    open ? "grid-rows-[1fr] px-4 pb-4 sm:px-5 sm:pb-5" : "grid-rows-[0fr] px-4 sm:px-5"
                )}
            >
                <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const { data: user, isLoading } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/dashboard");
        }
    }, [user, isLoading, router]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-orange-500/20 selection:text-orange-500">
            {/* ─────────────────────────────────────────
               Sticky Navigation Header
               ───────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                            <DevpilotIcon className="size-5" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold tracking-tight">AskMyRepo</span>
                            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400 border border-orange-500/20 font-mono">
                                v1.0
                            </span>
                        </div>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
                        <a href="#showcase" className="hover:text-foreground transition-colors">
                            Product Demo
                        </a>
                        <a href="#how-it-works" className="hover:text-foreground transition-colors">
                            Architecture
                        </a>
                        <a href="#security" className="hover:text-foreground transition-colors">
                            Security & Privacy
                        </a>
                        <a href="#pricing" className="hover:text-foreground transition-colors">
                            Pricing
                        </a>
                        <a href="#faq" className="hover:text-foreground transition-colors">
                            FAQ
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/karale-aryan/AskMyRepo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-xs font-mono text-foreground transition-all hover:border-border"
                        >
                            <GitHubIcon className="size-3.5" />
                            <Star className="size-3 text-amber-500 fill-amber-500" />
                            <span>Star on GitHub</span>
                        </a>

                        <ModeToggle />

                        {user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all shadow-sm"
                            >
                                <UserAvatar user={user} size="xs" />
                                <span className="max-w-[120px] truncate">{user.displayName || user.githubUsername}</span>
                                <ArrowRight className="size-3 text-orange-500" />
                            </Link>
                        ) : (
                            <a
                                href={getGitHubLoginUrl()}
                                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background transition-all hover:opacity-90 shadow-sm"
                            >
                                <GitHubIcon className="size-3.5" />
                                <span>Sign in</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* ─────────────────────────────────────────
                   SECTION 1: HERO (Clean, Breathing, Single Neutral Badge)
                   ───────────────────────────────────────── */}
                <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border/40">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 size-[600px] rounded-full bg-gradient-to-tr from-orange-500/10 to-amber-500/10 blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-40 -z-20 pointer-events-none" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                            {/* Hero Text */}
                            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                                {/* Single Subtle Neutral Badge */}
                                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1 text-xs text-orange-600 dark:text-orange-400 font-mono">
                                    <Sparkles className="size-3.5 text-orange-500" />
                                    <span>AST-Aware Codebase RAG</span>
                                </div>

                                {/* Headline */}
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                                    Chat with your GitHub repositories with{" "}
                                    <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                                        verifiable source citations
                                    </span>
                                </h1>

                                {/* Subtitle */}
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Index any public or private repository into vector embeddings. Query architecture, trace function flows, and inspect exact file and line references.
                                </p>

                                {/* Primary Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                                    <a
                                        href={getGitHubLoginUrl()}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/35 hover:-translate-y-0.5"
                                    >
                                        <GitHubIcon className="size-4" />
                                        <span>Get Started with GitHub</span>
                                        <ArrowRight className="size-4" />
                                    </a>

                                    <a
                                        href="#showcase"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/80 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                                    >
                                        <Code2 className="size-4 text-orange-500" />
                                        <span>Try Sandbox Demo</span>
                                    </a>
                                </div>

                                {/* Trust caption */}
                                <p className="text-xs text-muted-foreground font-mono pt-1">
                                    Free for public repositories · No credit card required · Open source under MIT
                                </p>
                            </div>

                            {/* 3D Interactive Vector Graph */}
                            <div className="lg:col-span-6 w-full h-[380px] lg:h-[440px]">
                                <Hero3DVectorGraph />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────
                   SECTION 2: PRODUCT DEMO & LIVE SANDBOX (Clean Heading, No Eyebrow)
                   ───────────────────────────────────────── */}
                <section id="showcase" className="py-16 sm:py-24 bg-background">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                                Explore the interactive product sandbox
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Test sample queries, inspect AST code citations, and explore the vector ingestion pipeline below.
                            </p>
                        </div>

                        {/* Interactive 3-View Sandbox Component */}
                        <ProductShowcaseTabs />
                    </div>
                </section>

                {/* ─────────────────────────────────────────
                   SECTION 3: ARCHITECTURE (Clean Heading, No Eyebrow)
                   ───────────────────────────────────────── */}
                <section id="how-it-works" className="py-16 sm:py-24 bg-muted/25 dark:bg-zinc-950/40 border-y border-border/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Built for source code ASTs, not generic text
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Generic RAG breaks code logic by slicing strings arbitrarily. AskMyRepo parses code respecting language syntax trees, function scopes, and type hierarchies.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group rounded-2xl border border-border/60 bg-card p-6 space-y-4 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all">
                                <div className="size-11 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <FolderGit2 className="size-5" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">
                                    1. Smart Repository Ingestion
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Clones target branches in-memory, filtering out vendor binaries, lockfiles, and generated assets automatically.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-border/60 bg-card p-6 space-y-4 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all">
                                <div className="size-11 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Code2 className="size-5" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">
                                    2. AST-Aware Syntax Chunking
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Code is parsed with Tree-sitter to preserve complete function declarations, classes, and docstrings rather than arbitrary line counts.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-border/60 bg-card p-6 space-y-4 shadow-sm hover:border-orange-500/40 hover:shadow-md transition-all">
                                <div className="size-11 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Zap className="size-5" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">
                                    3. Grounded Citations via pgvector
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Responses attach exact file and line coordinates (<code className="font-mono text-orange-500">#L45-L78</code>) linking directly to the verified source on GitHub.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────
                   SECTION 4: SECURITY & PRIVACY (Clean Heading, Defensible Claims)
                   ───────────────────────────────────────── */}
                <section id="security" className="py-16 sm:py-24 bg-background">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Security and privacy by design
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Transparent data protection policies designed for developers and engineering teams.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                        <EyeOff className="size-4" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                                        Zero Model Training Policy
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Your private code, AST symbols, and queries are used solely for session RAG context and are never used to train foundation AI models.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                        <Lock className="size-4" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                                        AES-256 Encrypted Tokens
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    GitHub OAuth credentials and API tokens are encrypted at rest with AES-256 before storage in PostgreSQL.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                        <Trash2 className="size-4" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                                        Instant Data Revocation
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Deleting an indexed repo purges stored embeddings, metadata chunks, and chat history immediately from the vector database.
                                </p>
                            </div>
                        </div>

                        {/* Self-Host Guarantee Box */}
                        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-muted/30 to-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                            <div className="space-y-1 text-center sm:text-left">
                                <p className="font-bold text-base text-foreground flex items-center justify-center sm:justify-start gap-2">
                                    <Server className="size-4 text-orange-500" />
                                    Looking for air-gapped on-premises deployment?
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Deploy AskMyRepo in your private VPC or Kubernetes cluster with local Ollama or vLLM instances.
                                </p>
                            </div>
                            <a
                                href="https://github.com/karale-aryan/AskMyRepo#docker-compose"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-mono font-semibold transition-colors"
                            >
                                <span>Docker Setup</span>
                                <ExternalLink className="size-3.5" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────
                   SECTION 5: PRICING (Clean Heading, Aligned Limits)
                   ───────────────────────────────────────── */}
                <section id="pricing" className="py-16 sm:py-24 bg-muted/25 dark:bg-zinc-950/50 border-t border-border/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Simple, transparent plans
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Free community cloud or self-host without limits on your own infrastructure.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Cloud Community Plan */}
                            <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                            Cloud Community
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold font-mono">
                                            Free
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-3xl font-extrabold text-foreground font-mono">$0</p>
                                        <p className="text-xs text-muted-foreground">No credit card required</p>
                                    </div>
                                    <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pt-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                            <span>Unlimited public GitHub repositories</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                            <span>Up to 3 active private repositories</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                            <span>AST syntax parsing with Tree-sitter</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                            <span>Vector search with verifiable source citations</span>
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    href={getGitHubLoginUrl()}
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
                                >
                                    <GitHubIcon className="size-4" />
                                    <span>Get Started Free</span>
                                </a>
                            </div>

                            {/* Self-Hosted Open Source */}
                            <div className="rounded-2xl border border-orange-500/40 bg-card p-6 sm:p-8 space-y-6 shadow-lg relative flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                            Self-Hosted MIT
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold font-mono">
                                            Open Source
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-3xl font-extrabold text-foreground font-mono">MIT License</p>
                                        <p className="text-xs text-muted-foreground">Host on your VPC, AWS, or local bare metal</p>
                                    </div>
                                    <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground pt-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-orange-500 shrink-0" />
                                            <span>Unlimited private repositories</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-orange-500 shrink-0" />
                                            <span>Bring your own LLMs (Ollama / Claude / OpenAI)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-orange-500 shrink-0" />
                                            <span>Air-gapped data isolation</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 text-orange-500 shrink-0" />
                                            <span>Full source code modification rights</span>
                                        </li>
                                    </ul>
                                </div>
                                <a
                                    href="https://github.com/karale-aryan/AskMyRepo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
                                >
                                    <GitHubIcon className="size-4" />
                                    <span>Clone on GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────
                   SECTION 6: FAQ ACCORDION (Clean Heading, No Eyebrow)
                   ───────────────────────────────────────── */}
                <section id="faq" className="py-16 sm:py-24 bg-background">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Frequently asked questions
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Answers regarding repository indexing, token security, and self-hosting.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <FaqItem
                                question="Does AskMyRepo work with multi-language and monorepo codebases?"
                                answer="Yes. AskMyRepo parses Go, TypeScript/JavaScript, Python, Java, Rust, C/C++, and SQL ASTs. For monorepos, you can query across all packages or scope searches to specific directories."
                                defaultOpen={true}
                            />
                            <FaqItem
                                question="What permissions does the GitHub OAuth app request?"
                                answer="For public repositories, we only request read-only profile access. For private repositories, we request read-only repository contents access. We never ask for write, commit, or administrative permissions on your GitHub account."
                            />
                            <FaqItem
                                question="Do you train AI models on private code?"
                                answer="No. Our strict zero-retention policy guarantees that your source code, chunk embeddings, and queries are solely used as RAG retrieval context for your active session and are never used to train foundation models."
                            />
                            <FaqItem
                                question="How does AST chunking differ from standard character splitting?"
                                answer="Standard RAG chunkers slice code every few hundred characters, breaking functions and classes across chunks. AskMyRepo uses Tree-sitter AST queries to respect function declarations, classes, and type boundaries so each embedding represents a complete semantic unit."
                            />
                            <FaqItem
                                question="Can I self-host with local LLMs (like Ollama)?"
                                answer="Yes. The entire backend and frontend are open-source. You can point the Spring Boot backend to a local Ollama endpoint or OpenAI-compatible local server for zero external API calls."
                            />
                        </div>
                    </div>
                </section>

                {/* ─────────────────────────────────────────
                   SECTION 7: BOTTOM CALL TO ACTION
                   ───────────────────────────────────────── */}
                <section className="py-16 sm:py-20 bg-gradient-to-b from-background via-muted/30 to-background border-t border-border/50">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-3xl overflow-hidden border border-orange-500/25 bg-gradient-to-br from-card via-background to-card p-8 sm:p-12 text-center space-y-6 shadow-xl">
                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
                                Start querying your repositories with AST citations
                            </h2>

                            <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                Index your first repository in seconds and search your code with verified line references.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                <a
                                    href={getGitHubLoginUrl()}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/35 hover:-translate-y-0.5"
                                >
                                    <GitHubIcon className="size-4" />
                                    <span>Get Started with GitHub</span>
                                    <ArrowRight className="size-4" />
                                </a>

                                <a
                                    href="https://github.com/karale-aryan/AskMyRepo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                                >
                                    <GitHubIcon className="size-4" />
                                    <span>Star on GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ─────────────────────────────────────────
               FOOTER
               ───────────────────────────────────────── */}
            <footer className="border-t border-border/50 bg-background py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand info */}
                        <div className="space-y-3 sm:col-span-2">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-xs">
                                    <DevpilotIcon className="size-4" />
                                </div>
                                <span className="font-bold text-base text-foreground">AskMyRepo</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                                Open-source AST-aware codebase search, semantic vector retrieval, and grounded AI assistant for public and private GitHub repositories.
                            </p>
                        </div>

                        {/* Product links */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 font-mono">
                                Product
                            </p>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a href={getGitHubLoginUrl()} className="text-muted-foreground hover:text-foreground transition-colors">
                                        Sign in with GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="#showcase" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Interactive Sandbox
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/karale-aryan/AskMyRepo#readme" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/karale-aryan/AskMyRepo/issues" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Report an issue
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal links */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 font-mono">
                                Legal & Trust
                            </p>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a href="https://github.com/karale-aryan/AskMyRepo/blob/main/PRIVACY.md" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/karale-aryan/AskMyRepo/blob/main/TERMS.md" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/karale-aryan/AskMyRepo/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                        MIT License
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                        <p>© {new Date().getFullYear()} AskMyRepo. Open source under MIT.</p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/karale-aryan/AskMyRepo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors flex items-center gap-1 font-mono"
                            >
                                <GitHubIcon className="size-3.5" />
                                <span>karale-aryan/AskMyRepo</span>
                            </a>
                            <span>·</span>
                            <a
                                href="https://github.com/karale-aryan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                Built by @karale-aryan
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}