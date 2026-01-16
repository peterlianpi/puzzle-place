"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, Trophy, User, Settings, LogOut, Gamepad2, BarChart3, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuthStatus } from "@/features/auth/api/use-auth-status";
import { authClient } from "@/lib/auth/auth-client";

// Navigation configuration
type NavItem = {
  href: string;
  label: string;
  icon: any;
  hasDropdown?: boolean;
};

const publicNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: null },
  { href: "/events", label: "Events", icon: null },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
];

const authenticatedNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Settings },
  { href: "/my-events", label: "My Events", icon: Calendar, hasDropdown: true },
  { href: "/events", label: "Events", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
];

const publicMobileItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const authenticatedMobileItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-events", label: "View My Events" },
  { href: "/events/create", label: "Create Event" },
  { href: "/events", label: "Browse Events" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStatus();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const getInitials = (name?: string, username?: string) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    if (username) return username.slice(0, 2).toUpperCase();
    return "U";
  };

  // Get navigation items based on auth state
  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;
  const mobileItems = isAuthenticated ? authenticatedMobileItems : publicMobileItems;

  return (
    <header className="bg-background h-16 sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <div className="flex flex-auto">
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Puzzle Place</h1>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-sm font-medium transition-colors flex items-center gap-2 ${isActive(item.href) ? "text-primary" : "hover:text-primary"
                        }`}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/my-events" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        View My Events
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/events/create" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Event
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${isActive(item.href) ? "text-primary" : "hover:text-primary"
                  }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {isLoading ? (
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || user.username || ""}
                    />
                    <AvatarFallback>
                      {getInitials(user.name || "", user.username || "")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.username}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">

          <nav className="flex flex-col px-4 pb-4 space-y-2">
            {mobileItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors py-2 ${isActive(item.href) ? "text-primary" : "hover:text-primary"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <div className="border-t pt-2 mt-2">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-sm font-medium hover:text-primary transition-colors py-2 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
