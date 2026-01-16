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
import { Menu, X, Trophy, User, Settings, LogOut, Gamepad2, BarChart3, Plus, Calendar, ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

// Navigation configuration
type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  hasDropdown?: boolean;
};

const publicNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: undefined },
  { href: "/events", label: "Events", icon: undefined },
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
  { href: "/my-events", label: "My Events", icon: Calendar, hasDropdown: true },
  { href: "/events", label: "Browse Events" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const pathname = usePathname();
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
      emailVerified: session.user.emailVerified || false,
    }
    : null;

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // const getInitials = (name?: string, username?: string) => {
  //   if (name)
  //     return name
  //       .split(" ")
  //       .map((n) => n[0])
  //       .join("")
  //       .toUpperCase();
  //   if (username) return username.slice(0, 2).toUpperCase();
  //   return "U";
  // };

  // Get navigation items based on auth state
  const navItems = session ? authenticatedNavItems : publicNavItems;
  const mobileItems = session ? authenticatedMobileItems : publicMobileItems;

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
                      <Link href="/my-events/create-event" className="flex items-center gap-2">
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
          {isPending ? (
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          ) : session && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || ""}
                      alt={user.name || ""}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/auth/profile`}>
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
            onClick={() => {
              setIsOpen(!isOpen);
              if (isOpen) {
                setMobileDropdownOpen(null); // Close dropdown when menu closes
              }
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">

          <nav className="flex flex-col px-4 pb-4 space-y-1">
            {mobileItems.map((item) => {
              if ('hasDropdown' in item && item.hasDropdown) {
                const isDropdownOpen = mobileDropdownOpen === item.href;
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setMobileDropdownOpen(isDropdownOpen ? null : item.href)}
                      className={`flex items-center justify-between w-full text-left text-sm font-medium transition-colors py-2 px-2 rounded-md hover:bg-muted ${isActive(item.href) ? "text-primary" : "hover:text-primary"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {'icon' in item && item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </span>
                      {isDropdownOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {isDropdownOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        <Link
                          href="/my-events"
                          className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 px-2 rounded-md hover:bg-muted ${isActive("/my-events") ? "text-primary" : "hover:text-primary"
                            }`}
                          onClick={() => {
                            setIsOpen(false);
                            setMobileDropdownOpen(null);
                          }}
                        >
                          <Calendar className="h-3 w-3" />
                          View My Events
                        </Link>
                        <Link
                          href="/my-events/create-event"
                          className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 px-2 rounded-md hover:bg-muted ${isActive("/my-events/create-event") ? "text-primary" : "hover:text-primary"
                            }`}
                          onClick={() => {
                            setIsOpen(false);
                            setMobileDropdownOpen(null);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          Create Event
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors py-2 px-2 rounded-md hover:bg-muted ${isActive(item.href) ? "text-primary" : "hover:text-primary"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            {!session && (
              <>
                <div className="border-t pt-2 mt-2">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-muted block"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-sm font-medium hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-muted block"
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
