export const queryKeys = {
    auth: {
        all: ["auth"] as const,
        me: () => [...queryKeys.auth.all, "me"] as const,
    },
    repo: {
        all: ["repo"] as const,
        list: () => [...queryKeys.repo.all, "list"] as const,
        githubList: () => [...queryKeys.repo.all, "github-list"] as const,
        details: (id: string) => [...queryKeys.repo.all, "details", id] as const,
        status: (id: string) => [...queryKeys.repo.all, "status", id] as const,
    },
    chat: {
        all: ["chat"] as const,
        session: (repositoryId: string) =>
            [...queryKeys.chat.all, "session", repositoryId] as const,
        messages: (sessionId: string) =>
            [...queryKeys.chat.all, "messages", sessionId] as const,
    },
};