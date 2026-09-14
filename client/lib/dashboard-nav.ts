import {
    FolderGit2,
    LayoutGrid,
    Settings,
    type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    exact?: boolean;
};

export type DashboardNavGroup = {
    label: string;
    items: DashboardNavItem[];
};

export const dashboardNavGroups: DashboardNavGroup[] = [
    {
        label: "Workspace",
        items: [
            {
                title: "Overview",
                href: "/dashboard/overview",
                icon: LayoutGrid,
            },
            {
                title: "Repositories",
                href: "/dashboard",
                icon: FolderGit2,
                exact: true,
            },
        ],
    },
    {
        label: "Account",
        items: [
            {
                title: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];

export function isDashboardNavActive(
    pathname: string,
    item: DashboardNavItem
): boolean {
    if (item.exact) {
        return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
