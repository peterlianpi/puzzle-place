"use client";

import * as React from "react";
import {
  BarChart3,
  Command,
  Gamepad2,
  Home,
  LifeBuoy,
  LogIn,
  Send,
  // Settings2,
  User,
  UserPlus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const user = session?.user
    ? {
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
      }
    : null;
  const navMain = session
    ? [
        {
          title: "Home",
          url: "/",
          icon: Home,
        },
        {
          title: "Browse Events",
          url: "/events",
          icon: Gamepad2,
        },
        {
          title: "My Events",
          url: "/my-events",
          icon: Gamepad2,
          items: [
            {
              title: "Create Event",
              url: "/my-events/create-event",
            },
            {
              title: "Manage Events",
              url: "/my-events",
            },
          ],
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: BarChart3,
        },
        {
          title: "Profile",
          url: "/auth/profile",
          icon: User,
        },
      ]
    : [
        {
          title: "Home",
          url: "/",
          icon: Home,
        },
        {
          title: "Browse Events",
          url: "/events",
          icon: Gamepad2,
        },
      ];

  const navSecondary = session
    ? [
        {
          title: "Privacy Policy",
          url: "/privacy",
          icon: LifeBuoy,
        },
        {
          title: "Terms of Service",
          url: "/terms",
          icon: Send,
        },
      ]
    : [
        {
          title: "Login",
          url: "/auth/login",
          icon: LogIn,
        },
        {
          title: "Sign Up",
          url: "/auth/signup",
          icon: UserPlus,
        },
        {
          title: "Privacy Policy",
          url: "/privacy",
          icon: LifeBuoy,
        },
        {
          title: "Terms of Service",
          url: "/terms",
          icon: Send,
        },
      ];

  return (
    <Sidebar className=" " {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Puzzle Place</span>
                  <span className="truncate text-xs">Games</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
