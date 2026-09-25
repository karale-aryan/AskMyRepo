"use client";

import React, { useState } from "react";
import {
    MessageSquare,
    FileCode,
    Cpu,
    GitBranch,
    CheckCircle2,
    ExternalLink,
    Search,
    Copy,
    Check,
    Layers,
    Database,
    Zap,
    Sparkles,
    ShieldCheck,
    Terminal,
    Code2,
    FolderTree,
    CornerDownRight
} from "lucide-react";

export function ProductShowcaseTabs() {
    const [activeTab, setActiveTab] = useState<"chat" | "citation" | "indexing">("chat");
    const [copied, setCopied] = useState(false);
    const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);

    const questions = [
        {
            q: "Where is the GitHub OAuth token decrypted and validated?",
            file: "backend/auth/jwt_guard.go",
            lines: "L45-L68",
            scope: "func ValidateOAuthSession(ctx context.Context)",
            codeSnippet: `func ValidateOAuthSession(ctx context.Context, token string) (*GitHubUser, error) {
    // 1. Decrypt AES-256 encrypted access token
    decrypted, err := crypto.DecryptAES256(token, os.Getenv("ENCRYPTION_SECRET"))
    if err != nil {
        return nil, ErrInvalidEncryptedToken
    }
    
    // 2. Validate token against GitHub OAuth endpoint
    req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/user", nil)
    req.Header.Set("Authorization", "Bearer "+decrypted)
    
    resp, err := httpClient.Do(req)
    if err != nil || resp.StatusCode != http.StatusOK {
        return nil, ErrUnauthorizedSession
    }
    
    var user GitHubUser
    json.NewDecoder(resp.Body).Decode(&user)
    return &user, nil
}`,
            explanation: "The GitHub OAuth access token is decrypted at runtime using AES-256 via `crypto.DecryptAES256()` and immediately validated against the GitHub `/user` endpoint before storing the session context."
        },
        {
            q: "How does the AST chunker handle language-specific function boundaries?",
            file: "backend/indexer/ast_parser.rs",
            lines: "L112-L148",
            scope: "impl CodeTreeSplitter for RustParser",
            codeSnippet: `pub fn chunk_source_file(file_path: &Path, content: &str) -> Vec<CodeChunk> {
    let mut parser = Parser::new();
    parser.set_language(&tree_sitter_rust::LANGUAGE.into()).unwrap();
    let tree = parser.parse(content, None).unwrap();
    
    let mut chunks = Vec::new();
    let mut cursor = QueryCursor::new();
    let query = Query::new(&tree_sitter_rust::LANGUAGE.into(), FUNCTION_QUERY).unwrap();
    
    for m in cursor.matches(&query, tree.root_node(), content.as_bytes()) {
        let node = m.captures[0].node;
        chunks.push(CodeChunk {
            file_path: file_path.to_string_lossy().into_owned(),
            start_line: node.start_position().row + 1,
            end_line: node.end_position().row + 1,
            symbol_name: extract_symbol_name(node, content),
            content: node.utf8_text(content.as_bytes()).unwrap().to_string(),
        });
    }
    chunks
}`,
            explanation: "AskMyRepo utilizes Tree-sitter AST queries to locate complete function and struct definitions, preventing broken chunks or orphaned brackets during vector embedding generation."
        },
        {
            q: "What is the similarity metric used for the pgvector cosine search?",
            file: "backend/db/vector_store.sql",
            lines: "L88-L105",
            scope: "CREATE OR REPLACE FUNCTION match_code_embeddings()",
            codeSnippet: `CREATE OR REPLACE FUNCTION match_code_embeddings (
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    repo_id_filter uuid
)
RETURNS TABLE (
    id uuid,
    file_path text,
    start_line int,
    end_line int,
    similarity float,
    content text
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.id,
        ce.file_path,
        ce.start_line,
        ce.end_line,
        1 - (ce.embedding <=> query_embedding) AS similarity,
        ce.content
    FROM code_embeddings ce
    WHERE ce.repository_id = repo_id_filter
      AND 1 - (ce.embedding <=> query_embedding) > match_threshold
    ORDER BY ce.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;`,
            explanation: "Searches execute using the pgvector cosine distance operator `<=>` indexed with HNSW, achieving sub-120ms vector queries across repos with tens of thousands of chunks."
        }
    ];

    const currentQ = questions[selectedQuestionIdx];

    const handleCopy = () => {
        navigator.clipboard.writeText(currentQ.codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full rounded-2xl border border-border/70 bg-card/70 shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Top Showcase Navigation Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-border/50 bg-muted/40 p-2 sm:px-4 sm:py-2.5 gap-2">
                {/* View switcher tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background/80 border border-border/50 shadow-inner">
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === "chat"
                                ? "bg-orange-500 text-white shadow-md font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                    >
                        <MessageSquare className="size-3.5" />
                        <span>1. Contextual Chat</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("citation")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === "citation"
                                ? "bg-orange-500 text-white shadow-md font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                    >
                        <FileCode className="size-3.5" />
                        <span>2. Code Citation Inspector</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("indexing")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeTab === "indexing"
                                ? "bg-orange-500 text-white shadow-md font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                    >
                        <Cpu className="size-3.5" />
                        <span>3. Indexing Pipeline</span>
                    </button>
                </div>

                {/* Right side repo status pill */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>repo: karale-aryan/AskMyRepo</span>
                    </div>
                    <span className="hidden md:inline-block text-[11px] font-mono text-muted-foreground">
                        main branch · 2.4k LoC
                    </span>
                </div>
            </div>

            {/* TAB 1: CONTEXTUAL CHAT */}
            {activeTab === "chat" && (
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                    {/* Left: Sample Question Selector */}
                    <div className="lg:col-span-4 space-y-2.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2 flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-orange-500" />
                            Select a sample query:
                        </p>
                        {questions.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedQuestionIdx(idx)}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 ${
                                    selectedQuestionIdx === idx
                                        ? "border-orange-500/60 bg-orange-500/10 text-foreground font-medium shadow-sm ring-1 ring-orange-500/30"
                                        : "border-border/60 bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <p className="leading-snug">{item.q}</p>
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground/80">
                                    <span className="px-1.5 py-0.5 rounded bg-muted/80 text-foreground/80 font-mono">
                                        {item.file.split("/").pop()}
                                    </span>
                                    <span>{item.lines}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: Live Chat Window */}
                    <div className="lg:col-span-8 flex flex-col justify-between rounded-xl border border-border/60 bg-background/90 p-4 sm:p-5 shadow-inner">
                        {/* Conversation Thread */}
                        <div className="space-y-4">
                            {/* User Question */}
                            <div className="flex items-start gap-3">
                                <div className="size-7 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                    YOU
                                </div>
                                <div className="flex-1 bg-muted/60 border border-border/40 rounded-2xl rounded-tl-none px-4 py-3 text-xs sm:text-sm text-foreground">
                                    {currentQ.q}
                                </div>
                            </div>

                            {/* AI Answer with verifiable citations */}
                            <div className="flex items-start gap-3">
                                <div className="size-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md">
                                    AI
                                </div>
                                <div className="flex-1 space-y-3 bg-card border border-border/70 rounded-2xl rounded-tl-none p-4 text-xs sm:text-sm shadow-md">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {currentQ.explanation}
                                    </p>

                                    {/* Line Citation Badge */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-mono text-xs font-medium">
                                            <FileCode className="size-3.5" />
                                            <span>{currentQ.file}</span>
                                            <span className="text-orange-500 font-bold">#{currentQ.lines}</span>
                                        </div>
                                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                            AST verified · cosine: 0.94
                                        </span>
                                    </div>

                                    {/* Code Block Snippet */}
                                    <div className="relative rounded-lg overflow-hidden border border-border/60 bg-zinc-950 font-mono text-xs text-zinc-200">
                                        <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/80 border-b border-zinc-800 text-[11px] text-zinc-400">
                                            <span>{currentQ.scope}</span>
                                            <button
                                                onClick={handleCopy}
                                                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 transition-colors"
                                            >
                                                {copied ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                                                <span>{copied ? "Copied" : "Copy"}</span>
                                            </button>
                                        </div>
                                        <pre className="p-3 overflow-x-auto text-[11px] sm:text-xs leading-relaxed font-mono">
                                            <code>{currentQ.codeSnippet}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Input preview */}
                        <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground font-mono">
                                <Search className="size-3.5 text-muted-foreground" />
                                <span>Ask any question about functions, dependencies, or schemas...</span>
                            </div>
                            <button
                                onClick={() => setActiveTab("citation")}
                                className="px-3.5 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                            >
                                <span>Inspect Citation</span>
                                <ExternalLink className="size-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: CODE CITATION & AST INSPECTOR */}
            {activeTab === "citation" && (
                <div className="p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-border/70 bg-zinc-950 text-zinc-200 overflow-hidden shadow-2xl">
                        {/* IDE Header */}
                        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="text-zinc-400">repo /</span>
                                <span className="text-white font-semibold">{currentQ.file}</span>
                                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-bold border border-orange-500/30">
                                    Highlighted: {currentQ.lines}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-400 text-xs">
                                <span>UTF-8</span>
                                <span>LF</span>
                                <span className="text-emerald-400">● Source-Grounded Citations</span>
                            </div>
                        </div>

                        {/* Split Editor */}
                        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[320px]">
                            {/* Left: AST Scope Navigator */}
                            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/40 p-4 space-y-3 font-mono text-xs">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <FolderTree className="size-3.5 text-orange-500" />
                                    Parsed AST Scope
                                </p>
                                <div className="space-y-1.5">
                                    <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-white font-medium">
                                        <div className="flex items-center gap-1.5 text-orange-400">
                                            <Code2 className="size-3.5" />
                                            <span>{currentQ.scope}</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 mt-1">
                                            Lines {currentQ.lines} · Vector Similarity: 0.942
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-zinc-900/40 text-zinc-400 text-[11px]">
                                        <span className="text-zinc-500">struct</span> GitHubUser &#123; ID, Login, Email &#125;
                                    </div>
                                    <div className="p-2 rounded-lg bg-zinc-900/40 text-zinc-400 text-[11px]">
                                        <span className="text-zinc-500">func</span> DecryptAES256(payload, secret)
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[11px] leading-relaxed">
                                    💡 <strong>Verifiable Grounding:</strong> AskMyRepo attaches the exact start/end row coordinates directly from Tree-sitter AST nodes so you can verify answers without hallucination.
                                </div>
                            </div>

                            {/* Right: Code Highlight View */}
                            <div className="md:col-span-8 p-4 font-mono text-xs overflow-x-auto bg-zinc-950">
                                <pre className="leading-relaxed">
                                    <code>{currentQ.codeSnippet}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: INDEXING PIPELINE */}
            {activeTab === "indexing" && (
                <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">Files Parsed</span>
                                <CheckCircle2 className="size-4 text-emerald-500" />
                            </div>
                            <p className="text-2xl font-bold font-mono text-foreground">148 files</p>
                            <p className="text-[11px] text-muted-foreground">AST Tree-sitter filtered</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">Vectors Stored</span>
                                <Database className="size-4 text-orange-500" />
                            </div>
                            <p className="text-2xl font-bold font-mono text-foreground">1,840</p>
                            <p className="text-[11px] text-muted-foreground">1536-dim text-embedding-3</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">Avg Index Time</span>
                                <Zap className="size-4 text-blue-500" />
                            </div>
                            <p className="text-2xl font-bold font-mono text-foreground">4.2s</p>
                            <p className="text-[11px] text-muted-foreground">Parallel batch ingestion</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">Query Latency</span>
                                <Sparkles className="size-4 text-emerald-500" />
                            </div>
                            <p className="text-2xl font-bold font-mono text-foreground">780ms</p>
                            <p className="text-[11px] text-muted-foreground">HNSW pgvector lookup</p>
                        </div>
                    </div>

                    {/* Visual 4-Step Pipeline Flow */}
                    <div className="p-5 rounded-xl border border-border/70 bg-muted/30 space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                            Automated RAG Ingestion Pipeline
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                            <div className="p-3.5 rounded-lg bg-card border border-border/60 space-y-1.5 shadow-sm">
                                <span className="text-[10px] font-bold text-orange-500 uppercase">Step 1 · Fetch</span>
                                <p className="font-semibold text-foreground">GitHub Tarball / API</p>
                                <p className="text-[11px] text-muted-foreground">Clones branches, strips non-code binaries & lockfiles automatically.</p>
                            </div>
                            <div className="p-3.5 rounded-lg bg-card border border-border/60 space-y-1.5 shadow-sm">
                                <span className="text-[10px] font-bold text-orange-500 uppercase">Step 2 · AST Parse</span>
                                <p className="font-semibold text-foreground">Tree-sitter Symbol Split</p>
                                <p className="text-[11px] text-muted-foreground">Segments functions, structs, classes, and types respecting scope.</p>
                            </div>
                            <div className="p-3.5 rounded-lg bg-card border border-border/60 space-y-1.5 shadow-sm">
                                <span className="text-[10px] font-bold text-orange-500 uppercase">Step 3 · Embed</span>
                                <p className="font-semibold text-foreground">Vector Generation</p>
                                <p className="text-[11px] text-muted-foreground">Computes 1536-dimensional embeddings with context window optimization.</p>
                            </div>
                            <div className="p-3.5 rounded-lg bg-card border border-border/60 space-y-1.5 shadow-sm">
                                <span className="text-[10px] font-bold text-orange-500 uppercase">Step 4 · Search</span>
                                <p className="font-semibold text-foreground">pgvector HNSW Index</p>
                                <p className="text-[11px] text-muted-foreground">Sub-second cosine similarity retrieval with instant line mapping.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
