"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/api";

interface UserAvatarProps {
    user?: User | null;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
    showName?: boolean;
    subtitle?: string;
}

const sizeClasses = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-9 text-sm",
    lg: "size-10 text-base",
    xl: "size-12 text-lg",
};

export function UserAvatar({
    user,
    size = "sm",
    className,
    showName = false,
    subtitle,
}: UserAvatarProps) {
    const [imageError, setImageError] = useState(false);

    const displayName = user?.displayName || user?.githubUsername || "Developer";
    const username = user?.githubUsername || "user";
    const avatarUrl = user?.avatarUrl;

    // Generate initials (e.g., "Aryan Karale" -> "AK", "Aryan" -> "A")
    const getInitials = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase() || "U";
    };

    return (
        <div className="inline-flex items-center gap-2.5 max-w-full">
            <div
                className={cn(
                    "relative shrink-0 rounded-full overflow-hidden border border-border/80 shadow-sm bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white select-none",
                    sizeClasses[size],
                    className
                )}
            >
                {avatarUrl && !imageError ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="size-full object-cover rounded-full"
                        onError={() => setImageError(true)}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <span>{getInitials(displayName)}</span>
                )}
            </div>

            {showName && (
                <div className="flex flex-col text-left leading-tight truncate">
                    <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                        {displayName}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate font-mono">
                        {subtitle ?? `@${username}`}
                    </span>
                </div>
            )}
        </div>
    );
}
