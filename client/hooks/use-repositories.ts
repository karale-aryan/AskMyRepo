"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type GitHubRepo, type Repository } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useRepositories() {
    return useQuery({
        queryKey: queryKeys.repo.list(),
        queryFn: api.listRepos,
        refetchInterval: (query) => {
            const data = query.state.data;
            const hasIndexing = Array.isArray(data) && data.some((r: Repository) => r.indexStatus === "INDEXING");
            return hasIndexing ? 2000 : false;
        },
    });
}

export function useGitHubRepos() {
    return useQuery({
        queryKey: queryKeys.repo.githubList(),
        queryFn: api.listGitHubRepos,
        staleTime: 5 * 60 * 1000, // 5 min cache
    });
}

export function useRepository(id: string) {
    return useQuery({
        queryKey: queryKeys.repo.details(id),
        queryFn: () => api.getRepo(id),
        enabled: !!id,
    });
}

export function useRepoStatus(id: string, enabled = false) {
    return useQuery({
        queryKey: queryKeys.repo.status(id),
        queryFn: () => api.getRepoStatus(id),
        enabled,
        refetchInterval: enabled ? 3000 : false,
    });
}

export function useAddRepo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (githubId: number) => api.addRepo(githubId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.repo.list() });
        },
    });
}

export function useRemoveRepo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.removeRepo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.repo.list() });
        },
    });
}

export function useTriggerIndex() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.triggerIndex(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.repo.list() });
            queryClient.invalidateQueries({
                queryKey: queryKeys.repo.status(data.id),
            });
        },
    });
}
