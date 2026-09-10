"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { api, ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export const AUTH_COOKIES = "devpilot-auth";

export function setAuthCookies(authed: boolean) {
    if (typeof document === "undefined") return;
    if (authed) {
        document.cookie = `${AUTH_COOKIES}=1; path=/; max-age={60 * 60 * 24 * 7}; samesite=lax`;
    } else {
        document.cookie = `${AUTH_COOKIES}=; path=/; max-age=0; samesite=lax`;
    }
}

export function useCurrentUser() {
    return useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => {
            try {
                const user = await api.me();
                setAuthCookies(true);
                return user;

            } catch (error) {
                setAuthCookies(false);
                throw error;
            }
        }
    })
}

export function logout() {


}