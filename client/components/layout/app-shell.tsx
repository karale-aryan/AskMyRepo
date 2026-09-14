"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

import { DevpilotIcon } from "@/components/icons/devpilot-icon";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  dashboardNavGroups,
  isDashboardNavActive,
} from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <DevpilotIcon className="size-8 rounded-[10px]" />
      <span className="font-heading text-[1.05rem] leading-none">
        AskMYRepo
      </span>
    </div>
  );
}

export function AppShell({ children, hideHeader = false }: { children: React.ReactNode; hideHeader?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader className="h-14 justify-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrandMark />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {dashboardNavGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isDashboardNavActive(pathname, item);
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={active}
                        >
                          <Icon className="size-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={user?.avatarUrl ?? undefined}
                      alt={user?.displayName ?? "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.displayName ?? user?.githubUsername ?? "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      @{user?.githubUsername ?? "user"}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatarUrl ?? undefined}
                          alt={user?.displayName ?? "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {user?.displayName?.charAt(0)?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.displayName ?? user?.githubUsername}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          @{user?.githubUsername}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/dashboard/settings"
                          className="cursor-pointer flex items-center"
                        />
                      }
                    >
                      <Settings className="mr-2 size-4" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {!hideHeader && (
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
