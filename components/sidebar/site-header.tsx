"use client";

import Link from "next/link";
import { MenuIcon, SidebarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background h-16 sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-10 w-10 hidden sm:flex"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon />
        </Button>
        <div className="flex flex-auto">
          <Link href="/">
            <h1 className="text-xl font-bold">Puzzle Place</h1>
          </Link>
        </div>

        <ModeToggle />
        <MenuButton className="sm:hidden ml-auto" />
      </div>
    </header>
  );
}

export function MenuButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open, isMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-12 w-12 bg-muted/50 hover:bg-muted", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      aria-label="Toggle navigation menu"
      {...props}
asChild    >
      {!isMobile && open ? <X size={24} /> : <MenuIcon size={24} />}
    </Button>
  );
}
