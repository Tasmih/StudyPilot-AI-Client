"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, BrainCircuit, Home, Star, Info, Mail, 
  LayoutDashboard, Calendar, MessageSquare, ListTodo, User,
  Compass, Sparkles, ChevronDown, LogOut, Settings
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);
  const [isUserOpen, setIsUserOpen] = React.useState(false);
  
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const moreRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
    setIsMoreOpen(false);
    setIsUserOpen(false);
  }, [pathname]);

  // Click outside handlers
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    }
    
    // Escape key handler
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        setIsUserOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  // Visible links on desktop for authenticated user
  const primaryLoggedInRoutes = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "AI Tutor", href: "/assistant", icon: MessageSquare },
    { name: "Recommendations", href: "/recommendations", icon: Sparkles },
  ];

  // Visible links on desktop for unauthenticated user
  const loggedOutRoutes = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  // More dropdown items for desktop
  const secondaryLoggedInRoutes = [
    { name: "My Items", href: "/items/manage", icon: ListTodo },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact / Support", href: "/contact", icon: Mail },
  ];

  // All routes for mobile menu (logical grouping)
  const allMobileLoggedInRoutes = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "AI Tutor", href: "/assistant", icon: MessageSquare },
    { name: "Recommendations", href: "/recommendations", icon: Sparkles },
    { name: "My Items", href: "/items/manage", icon: ListTodo },
    { name: "Profile", href: "/profile", icon: User },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact / Support", href: "/contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link href={session ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">StudyPilot AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-5">
          {session ? (
            <>
              {/* Primary Logged In Routes */}
              {primaryLoggedInRoutes.map((route) => {
                const isActive = pathname === route.href;
                const Icon = route.icon;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary py-1.5 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800",
                      isActive ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="mr-1.5 h-4 w-4" />
                    {route.name}
                  </Link>
                );
              })}

              {/* Secondary 'More' Dropdown */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  aria-expanded={isMoreOpen}
                  aria-haspopup="true"
                  aria-label="Toggle secondary navigation items"
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary py-1.5 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary",
                    isMoreOpen && "text-primary bg-primary/5"
                  )}
                >
                  <span>More</span>
                  <ChevronDown className={cn("ml-1 h-3.5 w-3.5 transition-transform duration-200", isMoreOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-48 rounded-xl border bg-card p-1 shadow-lg ring-1 ring-border/50 z-50 focus:outline-none"
                    >
                      {secondaryLoggedInRoutes.map((item) => {
                        const isSubActive = pathname === item.href;
                        const SubIcon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center w-full text-left rounded-lg px-3 py-2 text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium",
                              isSubActive ? "text-primary bg-primary/5 font-bold" : "text-muted-foreground"
                            )}
                          >
                            <SubIcon className="mr-2 h-4 w-4 shrink-0" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Logged Out Routes */
            loggedOutRoutes.map((route) => {
              const isActive = pathname === route.href;
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary py-1.5 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    isActive ? "text-primary bg-primary/5 font-semibold" : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {route.name}
                </Link>
              );
            })
          )}
        </nav>

        {/* Desktop Auth/User Dropdown */}
        <div className="hidden lg:flex items-center space-x-4">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            /* Profile Dropdown */
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                aria-expanded={isUserOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold select-none cursor-pointer py-1.5 px-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 border transition-all focus:outline-none focus:ring-1 focus:ring-primary",
                  isUserOpen ? "border-primary/40 bg-primary/5" : "border-border"
                )}
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="max-w-[120px] truncate text-foreground whitespace-nowrap">
                  {session.user.name || session.user.email}
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", isUserOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isUserOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl border bg-card p-1.5 shadow-lg ring-1 ring-border/50 z-50 focus:outline-none"
                  >
                    <div className="px-3 py-2 border-b border-border/40 mb-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Account</p>
                      <p className="text-xs font-semibold text-foreground truncate">{session.user.email}</p>
                    </div>

                    <Link href="/profile" className="flex items-center rounded-lg px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground font-medium">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      My Profile
                    </Link>
                    
                    <Link href="/dashboard" className="flex items-center rounded-lg px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground font-medium">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                      Dashboard Plans
                    </Link>

                    <Link href="/about" className="flex items-center rounded-lg px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground font-medium">
                      <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                      About StudyPilot
                    </Link>

                    <Link href="/contact" className="flex items-center rounded-lg px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground font-medium">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      Support Center
                    </Link>

                    <div className="border-t border-border/40 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full rounded-lg px-3 py-2 text-xs hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-bold transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle button */}
        <button
          className="lg:hidden flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-850 hover:text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation drawer"
        >
          {isOpen ? <X className="block h-5 w-5" /> : <Menu className="block h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer (Logical grouping navigation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t bg-background max-w-full"
          >
            <div className="space-y-1.5 px-4 pb-5 pt-3 max-w-full">
              {session ? (
                <>
                  {allMobileLoggedInRoutes.map((route) => {
                    const isActive = pathname === route.href;
                    const Icon = route.icon;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5 shrink-0" />
                        {route.name}
                      </Link>
                    );
                  })}
                  
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="px-3.5 text-xs text-muted-foreground font-medium mb-3">
                      Logged in: <span className="font-bold text-foreground">{session.user.email}</span>
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center rounded-lg px-3.5 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="mr-3 h-5 w-5 shrink-0" />
                      Logout Session
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {loggedOutRoutes.map((route) => {
                    const isActive = pathname === route.href;
                    const Icon = route.icon;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5 shrink-0" />
                        {route.name}
                      </Link>
                    );
                  })}
                  
                  <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-border/40 px-1">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full justify-center py-5">Sign In</Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full justify-center py-5">Get Started</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
