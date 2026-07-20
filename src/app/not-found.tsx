import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <div className="rounded-full bg-primary/10 p-5 mb-8 border border-primary/20 shadow-sm">
        <SearchX className="h-14 w-14 text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
        Page Not Found
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
        We couldn't find the page you were looking for. It may have been moved, deleted, or never existed.
      </p>
      <Link href="/">
        <Button size="lg" className="flex items-center gap-2 font-bold px-8 py-6 rounded-xl shadow-md transition-all hover:-translate-y-1">
          <Home className="h-5 w-5" />
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
