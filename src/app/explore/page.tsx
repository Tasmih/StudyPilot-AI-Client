"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  ListTodo,
  Clock,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface ExploreTemplate {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  tasksCount: number;
  imageUrl?: string;
  createdAt: string;
}

const CATEGORIES = [
  "Computer Science",
  "Mathematics",
  "Medical Science",
  "Business",
  "Humanities",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest-rating", label: "Highest Rating" },
  { value: "most-tasks", label: "Most Tasks" },
];

export default function ExplorePage() {
  const [templates, setTemplates] = useState<ExploreTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Debounced tracker
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search term change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1); // Reset page on query search
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "12");
      queryParams.append("sort", sort);
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);
      if (difficulty) queryParams.append("difficulty", difficulty);

      const res = await apiClient.get<{
        success: boolean;
        data: ExploreTemplate[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/api/explore?${queryParams.toString()}`);

      if (res.success) {
        setTemplates(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (err: any) {
      console.error("Explore Catalog fetch error:", err);
      setError(err.message || "Failed to load study templates from the database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [search, category, difficulty, sort, page]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSearch("");
    setCategory("");
    setDifficulty("");
    setSort("newest");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Difficulty colors mapping
  const difficultyBadges = {
    Beginner: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  // Render a visual background gradient based on category type
  const getCardBgGradient = (cat: string) => {
    switch (cat) {
      case "Computer Science":
        return "from-blue-600/10 to-indigo-600/5";
      case "Mathematics":
        return "from-purple-600/10 to-pink-600/5";
      case "Medical Science":
        return "from-emerald-600/10 to-teal-600/5";
      case "Business":
        return "from-amber-600/10 to-yellow-600/5";
      default:
        return "from-slate-600/10 to-slate-500/5";
    }
  };

  const hasActiveFilters = search !== "" || category !== "" || difficulty !== "";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow py-12 md:py-16 container max-w-6xl mx-auto px-4 space-y-8">
        
        {/* Title Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-2.5">
            <Compass className="h-8 w-8 md:h-12 md:w-12 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore Academic Programs
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Discover community-curated plans, standardized academic syllabi, and custom-made AI templates.
          </p>
        </div>

        {/* Search, Filter, Sort toolbar controls */}
        <Card className="bg-card/50 backdrop-blur-md border-border/80 p-4 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 items-center w-full">
            
            {/* Search Input bar */}
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates or topics..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-background border-border hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category selection */}
            <div className="w-full lg:w-[240px] shrink-0">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background border-border hover:border-primary/50 focus:border-primary focus:outline-none outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty selection */}
            <div className="w-full lg:w-[180px] shrink-0">
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background border-border hover:border-primary/50 focus:border-primary focus:outline-none outline-none cursor-pointer"
              >
                <option value="">All Difficulties</option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order selection */}
            <div className="w-full lg:w-[180px] shrink-0">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-background border-border hover:border-primary/50 focus:border-primary focus:outline-none outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters status indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>Active Filters:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Query: "{search}"
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    Cat: {category}
                  </span>
                )}
                {difficulty && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                    Diff: {difficulty}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="h-7 px-2.5 text-xs font-semibold flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </Button>
            </div>
          )}
        </Card>

        {/* Listing display layouts */}
        {isLoading ? (
          /* Skeletons */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse flex flex-col justify-between overflow-hidden h-[340px]">
                <div className="h-40 bg-muted w-full" />
                <CardHeader className="space-y-2 pt-4 pb-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-8 bg-muted rounded w-full" />
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-9 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          /* Error display */
          <div className="max-w-md mx-auto py-12">
            <Card className="border-destructive/30 text-center shadow-md">
              <CardContent className="pt-8 pb-8 space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Catalog Error</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <Button onClick={fetchTemplates} variant="outline" className="mt-2">
                  Retry Loading
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : templates.length === 0 ? (
          /* Empty Search results layout */
          <div className="max-w-md mx-auto py-12">
            <Card className="border-dashed border-2 text-center p-8 space-y-4 bg-card/40">
              <Compass className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">No Templates Match Filters</h3>
                <p className="text-sm text-muted-foreground leading-normal">
                  Try revising your search term, changing categories, or clearing active filters.
                </p>
              </div>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters} className="mt-2">
                  Reset Catalog
                </Button>
              )}
            </Card>
          </div>
        ) : (
          /* Results grid */
          <div className="space-y-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {templates.map((item) => (
                <Card
                  key={item.id}
                  className="bg-card border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group rounded-[20px]"
                >
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    {/* Category fallback gradient always loaded in background */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br", getCardBgGradient(item.category))} />
                    
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <CardHeader className="p-5 pb-0 flex-grow flex flex-col space-y-3">
                    {/* Badges row immediately below the image */}
                    <div className="flex items-center justify-between w-full select-none">
                      {/* Category badge - light neutral background */}
                      <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                        {item.category}
                      </span>
                      {/* Difficulty badge - subtle blue background */}
                      <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                        {item.difficulty}
                      </span>
                    </div>

                    <CardTitle className="text-sm font-bold text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors leading-snug pt-1">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2rem]">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 mt-auto flex flex-col gap-4">
                    {/* Metadata tags */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 border-t border-border/40 pt-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {item.duration}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <ListTodo className="h-3.5 w-3.5 text-muted-foreground" />
                        {item.tasksCount} tasks
                      </span>
                      <span className="flex items-center gap-0.5 font-bold text-yellow-600 dark:text-yellow-500">
                        <Star className="h-3.5 w-3.5 fill-current text-yellow-500 shrink-0" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* View details redirection path */}
                    <Link href={`/explore/${item.id}`} className="block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all py-2 h-10 group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6 select-none">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="h-9 w-9 rounded-lg"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Render numeric page indices */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const targetPage = idx + 1;
                  return (
                    <Button
                      key={targetPage}
                      variant={page === targetPage ? "primary" : "outline"}
                      onClick={() => handlePageChange(targetPage)}
                      className={cn(
                        "h-9 w-9 text-xs rounded-lg font-semibold",
                        page === targetPage
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {targetPage}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="h-9 w-9 rounded-lg"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="text-center text-3xs text-muted-foreground/60">
              Showing {templates.length} of {total} templates found in the StudyPilot AI Catalog.
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
