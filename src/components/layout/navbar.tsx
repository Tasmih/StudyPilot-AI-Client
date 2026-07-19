"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, BrainCircuit, Home, Star, Info, Mail, 
  LayoutDashboard, Calendar, MessageSquare, ListTodo, User,
  Compass, Sparkles
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const loggedOutRoutes = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const loggedInRoutes = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Planner", href: "/planner", icon: Calendar },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "AI Tutor", href: "/assistant", icon: MessageSquare },
    { name: "Recommendations", href: "/recommendations", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const routes = session ? loggedInRoutes : loggedOutRoutes;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={session ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">StudyPilot AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            const Icon = route.icon;
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {route.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
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

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t bg-background"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {routes.map((route) => {
                const isActive = pathname === route.href;
                const Icon = route.icon;

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {route.name}
                  </Link>
                );
              })}
              
              <div className="mt-4 pt-4 border-t">
                {isPending ? (
                  <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                ) : session ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Logged in as <span className="font-medium text-foreground">{session.user.email}</span>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-3">
                    <Link href="/login">
                      <Button variant="outline" className="w-full justify-center">Sign In</Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-center">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
