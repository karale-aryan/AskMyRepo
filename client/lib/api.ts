export type User = {
    id: string;
    githubId: number;
    githubUsername: string;
    displayName: string;
    avatarUrl: string | null;
};

export type IndexStatus = "PENDING" | "INDEXING" | "INDEXED" | "FAILED";

export type Repository = {
    id: string;
    githubUrlId: number;
    owner: string;
    name: string;
    fullName: string;
    isPrivate: boolean;
    description: string | null;
    htmlUrl: string;
    language: string | null;
    defaultBranch: string;
    indexStatus: IndexStatus;
    indexedAt: string | null;
    chunkCount: number;
    filesTotal: number;
    filesProcessed: number;
    errorMessage: string | null;
    createdAt: string;
};

export type GitHubRepo = {
    id: number;
    name: string;
    fullName: string;
    isPrivate: boolean;
    description: string | null;
    htmlUrl: string;
    language: string | null;
    defaultBranch: string;
    owner: {
        login: string;
    };
};

export type ChatSession = {
    id: string;
    repositoryId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
};

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
};

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function getApiBaseUrl() {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
}

export function getGithubLoginUrl() {
    return `${getApiBaseUrl()}/oauth2/authorization/github`;
}

async function parseError(res: Response): Promise<string> {
    try {
        const data = await res.json();
        return data.message ?? data.error ?? res.statusText;
    } catch {
        return res.statusText || "Request failed";
    }
}

export async function apiFetch<T>(
    path: string,
    init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
    const { timeoutMs = 120_000, ...fetchInit } = init ?? {};

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(`${getApiBaseUrl()}${path}`, {
            ...fetchInit,
            credentials: "include",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(fetchInit?.headers ?? {}),
            },
        });

        if (!res.ok) {
            throw new ApiError(res.status, await parseError(res));
        }

        if (res.status === 204) {
            return undefined as T;
        }

        return (await res.json()) as T;
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
            throw new ApiError(408, "Request timed out. Please try again.");
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }
}

export const api = {
    // Auth
    me: () => apiFetch<User>("/api/auth/me"),
    logout: () => apiFetch("/api/auth/logout", { method: "POST" }),

    // Repositories
    listRepos: () => apiFetch<Repository[]>("/api/repositories"),
    listGitHubRepos: () => apiFetch<GitHubRepo[]>("/api/repositories/github"),
    addRepo: (githubId: number) =>
        apiFetch<Repository>("/api/repositories", {
            method: "POST",
            body: JSON.stringify({ githubId }),
        }),
    removeRepo: (id: string) =>
        apiFetch<void>(`/api/repositories/${id}`, { method: "DELETE" }),
    getRepo: (id: string) => apiFetch<Repository>(`/api/repositories/${id}`),
    triggerIndex: (id: string) =>
        apiFetch<Repository>(`/api/repositories/${id}/index`, { method: "POST" }),
    getRepoStatus: (id: string) =>
        apiFetch<Repository>(`/api/repositories/${id}/status`),

    // Chat
    getOrCreateSession: (repositoryId: string) =>
        apiFetch<ChatSession>(`/api/chat/sessions?repositoryId=${repositoryId}`, {
            method: "POST",
        }),
    getMessages: (sessionId: string) =>
        apiFetch<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`),
    sendMessage: (sessionId: string, content: string) =>
        apiFetch<ChatMessage>(`/api/chat/sessions/${sessionId}/messages`, {
            method: "POST",
            body: JSON.stringify({ content }),
        }),
};