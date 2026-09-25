"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Terminal, Cpu, Database, Network } from "lucide-react";

interface Node3D {
    id: string;
    label: string;
    file: string;
    lang: string;
    x: number;
    y: number;
    z: number;
    baseSize: number;
    color: string;
    similarity?: number;
}

interface Edge3D {
    from: number;
    to: number;
    strength: number;
}

export function Hero3DVectorGraph() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    const [queryActive, setQueryActive] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
        let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        };

        window.addEventListener("resize", handleResize);

        // Define 3D Node data representing code AST & vector embeddings
        const rawNodes: Omit<Node3D, "similarity">[] = [
            { id: "1", label: "authenticateToken()", file: "auth/jwt_guard.go", lang: "Go", x: -140, y: -80, z: 40, baseSize: 7, color: "#f97316" },
            { id: "2", label: "EmbeddingService", file: "services/vector.py", lang: "Python", x: 130, y: -90, z: -30, baseSize: 8, color: "#38bdf8" },
            { id: "3", label: "ASTCodeChunker", file: "ast/parser.rs", lang: "Rust", x: 0, y: 110, z: 80, baseSize: 9, color: "#ec4899" },
            { id: "4", label: "pgvector_query()", file: "db/similarity.sql", lang: "SQL", x: -90, y: 70, z: -70, baseSize: 6, color: "#10b981" },
            { id: "5", label: "useRepoChat()", file: "hooks/useChat.ts", lang: "TypeScript", x: 110, y: 60, z: 60, baseSize: 7, color: "#a855f7" },
            { id: "6", label: "RateLimitFilter", file: "security/RateLimit.java", lang: "Java", x: -60, y: -130, z: -20, baseSize: 6, color: "#eab308" },
            { id: "7", label: "PromptAssembler", file: "ai/rag_pipeline.py", lang: "Python", x: 60, y: -40, z: 90, baseSize: 7, color: "#06b6d4" },
            { id: "8", label: "GitHubOAuthController", file: "api/auth.go", lang: "Go", x: -160, y: 20, z: 30, baseSize: 6, color: "#f97316" },
            { id: "9", label: "StreamResponseHandler", file: "stream/sse.ts", lang: "TypeScript", x: 150, y: -20, z: -60, baseSize: 6, color: "#a855f7" },
        ];

        const edges: Edge3D[] = [
            { from: 0, to: 7, strength: 0.94 },
            { from: 7, to: 1, strength: 0.88 },
            { from: 1, to: 3, strength: 0.96 },
            { from: 2, to: 1, strength: 0.91 },
            { from: 2, to: 6, strength: 0.85 },
            { from: 4, to: 6, strength: 0.79 },
            { from: 0, to: 7, strength: 0.92 },
            { from: 7, to: 8, strength: 0.89 },
            { from: 3, to: 4, strength: 0.76 },
            { from: 5, to: 0, strength: 0.82 },
        ];

        // Background ambient particles
        const particles = Array.from({ length: 45 }, () => ({
            x: (Math.random() - 0.5) * 450,
            y: (Math.random() - 0.5) * 400,
            z: (Math.random() - 0.5) * 400,
            size: Math.random() * 2 + 0.8,
            speed: Math.random() * 0.002 + 0.001,
        }));

        let rotX = 0.2;
        let rotY = 0;
        let targetRotX = 0.2;
        let targetRotY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let isMouseDown = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let pulseTimer = 0;

        const onMouseDown = (e: MouseEvent) => {
            isMouseDown = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            setIsInteracting(true);
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            if (isMouseDown) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                targetRotY += dx * 0.008;
                targetRotX -= dy * 0.008;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        };

        const onMouseUp = () => {
            isMouseDown = false;
            setIsInteracting(false);
        };

        canvas.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        // Touch support
        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                isMouseDown = true;
                lastMouseX = e.touches[0].clientX;
                lastMouseY = e.touches[0].clientY;
            }
        };
        const onTouchMove = (e: TouchEvent) => {
            if (isMouseDown && e.touches.length === 1) {
                const dx = e.touches[0].clientX - lastMouseX;
                const dy = e.touches[0].clientY - lastMouseY;
                targetRotY += dx * 0.008;
                targetRotX -= dy * 0.008;
                lastMouseX = e.touches[0].clientX;
                lastMouseY = e.touches[0].clientY;
            }
        };
        const onTouchEnd = () => {
            isMouseDown = false;
        };

        canvas.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);

        // Main Render Loop
        const render = () => {
            pulseTimer += 0.025;

            // Auto subtle rotation when idle
            if (!isMouseDown) {
                targetRotY += 0.0035;
                targetRotX = Math.sin(pulseTimer * 0.3) * 0.15;
            }

            // Smooth interpolation
            rotX += (targetRotX - rotX) * 0.08;
            rotY += (targetRotY - rotY) * 0.08;

            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const fov = 340;

            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);

            // Project 3D coordinate to 2D screen
            const project = (x: number, y: number, z: number) => {
                // Rotate around Y
                const x1 = x * cosY - z * sinY;
                const z1 = z * cosY + x * sinY;
                // Rotate around X
                const y2 = y * cosX - z1 * sinX;
                const z2 = z1 * cosX + y * sinX;

                const distance = 420;
                const scale = fov / (distance + z2);
                const px = cx + x1 * scale;
                const py = cy + y2 * scale;
                return { px, py, scale, z: z2 };
            };

            // Draw ambient vector particles
            particles.forEach((p) => {
                p.y += Math.sin(pulseTimer + p.x) * 0.2;
                const proj = project(p.x, p.y, p.z);
                if (proj.scale > 0) {
                    const alpha = Math.max(0.1, Math.min(0.4, (proj.scale - 0.4) * 0.8));
                    ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Project all main nodes
            const projectedNodes = rawNodes.map((n, idx) => {
                const proj = project(n.x, n.y, n.z);
                return {
                    ...n,
                    rawIndex: idx,
                    px: proj.px,
                    py: proj.py,
                    scale: proj.scale,
                    z: proj.z,
                };
            });

            // Draw Edges (Vector similarity graph connections)
            edges.forEach((edge, i) => {
                const fromNode = projectedNodes[edge.from];
                const toNode = projectedNodes[edge.to];
                if (!fromNode || !toNode) return;

                const avgScale = (fromNode.scale + toNode.scale) / 2;
                const distZ = (fromNode.z + toNode.z) / 2;
                const alpha = Math.max(0.08, Math.min(0.45, (1 - distZ / 300) * edge.strength));

                // Draw connecting edge line
                ctx.beginPath();
                ctx.strokeStyle = `rgba(249, 115, 22, ${alpha * 0.7})`;
                ctx.lineWidth = 1.2 * avgScale;
                ctx.setLineDash([4, 4]);
                ctx.moveTo(fromNode.px, fromNode.py);
                ctx.lineTo(toNode.px, toNode.py);
                ctx.stroke();
                ctx.setLineDash([]);

                // Animated glowing data pulse along edge
                const pulsePos = (pulseTimer * 0.8 + i * 0.35) % 1;
                const pulseX = fromNode.px + (toNode.px - fromNode.px) * pulsePos;
                const pulseY = fromNode.py + (toNode.py - fromNode.py) * pulsePos;

                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.3})`;
                ctx.arc(pulseX, pulseY, 2.2 * avgScale, 0, Math.PI * 2);
                ctx.fill();
            });

            // Check mouse hover on 2D projected coordinates
            let foundHover: Node3D | null = null;
            const dpr = window.devicePixelRatio || 1;
            const screenMouseX = mouseX * dpr;
            const screenMouseY = mouseY * dpr;

            // Sort nodes by Z-index (render farthest first)
            const sortedNodes = [...projectedNodes].sort((a, b) => b.z - a.z);

            sortedNodes.forEach((node) => {
                const nodeRadius = node.baseSize * node.scale;
                const dx = screenMouseX - node.px;
                const dy = screenMouseY - node.py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const isHovered = dist < Math.max(22, nodeRadius * 2.2);
                if (isHovered && !foundHover) {
                    foundHover = {
                        id: node.id,
                        label: node.label,
                        file: node.file,
                        lang: node.lang,
                        x: node.x,
                        y: node.y,
                        z: node.z,
                        baseSize: node.baseSize,
                        color: node.color,
                        similarity: 0.92 + (parseInt(node.id) % 7) * 0.01,
                    };
                }

                // Outer Halo / Glow
                const glowGrad = ctx.createRadialGradient(
                    node.px,
                    node.py,
                    0,
                    node.px,
                    node.py,
                    nodeRadius * (isHovered ? 4.5 : 2.8)
                );
                glowGrad.addColorStop(0, `${node.color}66`);
                glowGrad.addColorStop(1, "transparent");
                ctx.fillStyle = glowGrad;
                ctx.beginPath();
                ctx.arc(node.px, node.py, nodeRadius * (isHovered ? 4.5 : 2.8), 0, Math.PI * 2);
                ctx.fill();

                // Core Node Circle
                ctx.beginPath();
                ctx.fillStyle = isHovered ? "#ffffff" : node.color;
                ctx.arc(node.px, node.py, nodeRadius * (isHovered ? 1.3 : 1), 0, Math.PI * 2);
                ctx.fill();

                // Border Ring
                ctx.beginPath();
                ctx.strokeStyle = isHovered ? "#f97316" : "rgba(255,255,255,0.4)";
                ctx.lineWidth = 1.5 * node.scale;
                ctx.arc(node.px, node.py, nodeRadius * (isHovered ? 1.5 : 1.2), 0, Math.PI * 2);
                ctx.stroke();

                // Node Floating Label Tag
                if (node.scale > 0.65 || isHovered) {
                    const labelText = node.label;
                    ctx.font = `${isHovered ? "bold " : ""}${Math.round(11 * node.scale)}px "JetBrains Mono", ui-monospace, monospace`;
                    const textWidth = ctx.measureText(labelText).width;
                    const tagPadX = 6 * node.scale;
                    const tagPadY = 3 * node.scale;
                    const tagX = node.px + nodeRadius + 6 * node.scale;
                    const tagY = node.py - 6 * node.scale;

                    // Label background pill
                    ctx.fillStyle = isHovered ? "rgba(24, 24, 27, 0.95)" : "rgba(15, 23, 42, 0.75)";
                    ctx.strokeStyle = isHovered ? node.color : "rgba(255,255,255,0.15)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.roundRect(tagX, tagY - 10 * node.scale, textWidth + tagPadX * 2, 16 * node.scale, 4);
                    ctx.fill();
                    ctx.stroke();

                    // Text
                    ctx.fillStyle = isHovered ? "#ffffff" : "rgba(226, 232, 240, 0.9)";
                    ctx.fillText(labelText, tagX + tagPadX, tagY + 2 * node.scale);
                }
            });

            setHoveredNode(foundHover);
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            canvas.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, []);

    return (
        <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-b from-card/80 via-background to-card/50 shadow-2xl backdrop-blur-xl flex flex-col justify-between group">
            {/* Top Toolbar / Status Bar */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/60 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-full bg-red-500/80" />
                        <span className="size-2.5 rounded-full bg-yellow-500/80" />
                        <span className="size-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground ml-2 flex items-center gap-1.5">
                        <Network className="size-3.5 text-orange-500 animate-pulse" />
                        3D Code Knowledge Graph · pgvector
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        <span className="size-1.5 rounded-full bg-orange-500 animate-ping" />
                        Live AST Indexing
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/80">
                        Drag to rotate 3D
                    </span>
                </div>
            </div>

            {/* Interactive 3D Canvas */}
            <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full block"
                    style={{ minHeight: "320px" }}
                />

                {/* Center Vector Query Scanner overlay */}
                <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card/90 border border-border/70 backdrop-blur-md shadow-md text-xs font-mono">
                        <Database className="size-3.5 text-blue-500" />
                        <span className="text-muted-foreground">Embedding:</span>
                        <span className="text-foreground font-semibold">text-embedding-3-small</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">1536 dims</span>
                    </div>
                </div>

                {/* Hover Details Card in Corner */}
                {hoveredNode && (
                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3 rounded-xl bg-card/95 border border-orange-500/30 backdrop-blur-xl shadow-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-orange-400 font-semibold">
                                {hoveredNode.lang} AST Scope
                            </span>
                            <span className="text-[11px] font-mono text-emerald-500 font-medium">
                                sim: {hoveredNode.similarity?.toFixed(3)}
                            </span>
                        </div>
                        <p className="font-mono text-xs font-semibold text-foreground truncate">
                            {hoveredNode.label}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">
                            📁 {hoveredNode.file}
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Legend */}
            <div className="relative z-10 px-4 py-2.5 border-t border-border/40 bg-background/60 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-muted-foreground font-mono gap-2">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-orange-500" /> Go / Backend
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-sky-400" /> Python / RAG
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-purple-400" /> TypeScript
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                    <Sparkles className="size-3 text-orange-500" />
                    <span>Cosine Distance Metric (0.85+ thresh)</span>
                </div>
            </div>
        </div>
    );
}
