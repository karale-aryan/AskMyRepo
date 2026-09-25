"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ChatMessage, type ChatSession } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useChatSession(repositoryId: string) {
    return useQuery({
        queryKey: queryKeys.chat.session(repositoryId),
        queryFn: () => api.getOrCreateSession(repositoryId),
        enabled: !!repositoryId,
    });
}

export function useChatMessages(sessionId: string) {
    return useQuery({
        queryKey: queryKeys.chat.messages(sessionId),
        queryFn: () => api.getMessages(sessionId),
        enabled: !!sessionId,
    });
}

export function useSendMessage(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (content: string) => api.sendMessage(sessionId, content),
        onMutate: async (content: string) => {
            // Cancel any outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({
                queryKey: queryKeys.chat.messages(sessionId),
            });

            // Snapshot the previous messages
            const previousMessages = queryClient.getQueryData<ChatMessage[]>(
                queryKeys.chat.messages(sessionId)
            );

            // Optimistically add the user message so it appears immediately
            const optimisticUserMsg: ChatMessage = {
                id: `optimistic-${Date.now()}`,
                role: "user",
                content,
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData<ChatMessage[]>(
                queryKeys.chat.messages(sessionId),
                (old) => [...(old ?? []), optimisticUserMsg]
            );

            return { previousMessages };
        },
        onSuccess: () => {
            // Refetch to get the real user message ID and the assistant response
            queryClient.invalidateQueries({
                queryKey: queryKeys.chat.messages(sessionId),
            });
        },
        onError: (_err, _content, context) => {
            // Roll back to the previous messages on error
            if (context?.previousMessages) {
                queryClient.setQueryData(
                    queryKeys.chat.messages(sessionId),
                    context.previousMessages
                );
            }
        },
    });
}
