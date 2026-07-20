"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Award,
  Star,
  ListTodo,
  Clock,
  Wand2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ExploreDetailsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data: session } = useSession();

  const [template, setTemplate] = useState<ExploreTemplate | null>(null);
  const [related, setRelated] = useState<ExploreTemplate[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);

  const fetchTemplate = async () => {
    setIsLoading(true);
    setError(null);
    setIs404(false);
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: ExploreTemplate;
      }>(`/api/explore/${id}`);

      if (res.success && res.data) {
        setTemplate(res.data);
      } else {
        setIs404(true);
      }
    } catch (err: any) {
      console.error("Explore template fetch error:", err);
      if (err.status === 404) {
        setIs404(true);
      } else {
        setError(err.message || "Failed to load the study template details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelated = async (categoryName: string) => {
    setIsLoadingRelated(true);
    setRelatedError(null);
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: ExploreTemplate[];
      }>(`/api/explore?category=${encodeURIComponent(categoryName)}&limit=10`);

      if (res.success && res.data) {
        // Filter out current template by ID and slice to first 4 related
        const filtered = res.data.filter((item) => item.id !== id).slice(0, 4);
        setRelated(filtered);
      } else {
        setRelatedError("Failed to fetch related study programs.");
      }
    } catch (err: any) {
      console.error("Related templates fetch error:", err);
      setRelatedError(err.message || "Failed to load related study programs.");
    } finally {
      setIsLoadingRelated(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  useEffect(() => {
    if (template?.category) {
      fetchRelated(template.category);
    }
  }, [template?.category, id]);

  // Difficulty badge colors mapping
  const difficultyColors = {
    Beginner: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  // Card header color gradients matching explore page
  const getCategoryGradient = (cat?: string) => {
    if (!cat) return "from-slate-600 to-slate-800";
    switch (cat) {
      case "Computer Science":
        return "from-blue-600/20 to-indigo-600/5";
      case "Mathematics":
        return "from-purple-600/20 to-pink-600/5";
      case "Medical Science":
        return "from-emerald-600/20 to-teal-600/5";
      case "Business":
        return "from-amber-600/20 to-yellow-600/5";
      default:
        return "from-slate-600/20 to-slate-500/5";
    }
  };

  // Generate prefill URL parameters for planner redirection
  const getPrefillPlannerUrl = () => {
    if (!template) return "/planner";
    const baseParams = new URLSearchParams();
    baseParams.append("subject", template.title);
    baseParams.append("difficulty", template.difficulty);
    baseParams.append("instructions", template.description);

    if (session) {
      return `/planner?${baseParams.toString()}`;
    } else {
      // Redirect to login first, then proceed to planner with the prefilled catalog items
      const loginParams = new URLSearchParams();
      loginParams.append("redirectTo", `/planner?${baseParams.toString()}`);
      return `/login?${loginParams.toString()}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 container max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Back navigation link */}
        <div className="flex items-center">
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Button>
          </Link>
        </div>

        {isLoading ? (
          /* Skeletons */
          <Card className="animate-pulse border-border/80 bg-card/50 backdrop-blur-md shadow-md overflow-hidden relative">
            <div className="h-64 md:h-80 bg-muted w-full" />
            <CardHeader className="space-y-4 pt-6">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-16 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
              <div className="h-10 bg-muted rounded w-48" />
            </CardContent>
          </Card>
        ) : is404 ? (
          /* 404 view */
          <Card className="border-dashed border-2 text-center p-12 bg-card/40 max-w-lg mx-auto">
            <CardContent className="space-y-4 pt-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Template Not Found</h3>
                <p className="text-sm text-muted-foreground">
                  The requested study program template could not be located in our catalog. It may have been removed or has an invalid address.
                </p>
              </div>
              <Link href="/explore" className="block pt-2">
                <Button>Return to Explore Catalog</Button>
              </Link>
            </CardContent>
          </Card>
        ) : error ? (
          /* Error Retry view */
          <Card className="border-destructive/30 text-center shadow-md max-w-lg mx-auto">
            <CardContent className="pt-10 pb-10 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Failed to Load Details</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button onClick={fetchTemplate} variant="outline" className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Main content view */
          <>
            <Card className="border-border/80 bg-card/50 backdrop-blur-md shadow-lg overflow-hidden relative">
            
            {/* Template image banner */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-muted">
              {/* Category fallback gradient always loaded in background */}
              <div className={cn("absolute inset-0 bg-gradient-to-br", getCategoryGradient(template?.category))} />
              
              {template?.imageUrl && (
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Category overlay badge */}
              <div className="absolute top-4 left-4 select-none">
                <span className="text-xs px-3 py-1 rounded-md bg-background/95 text-foreground font-bold uppercase tracking-wider shadow-md border border-border/40">
                  {template?.category}
                </span>
              </div>
              {/* Difficulty overlay badge */}
              <div className="absolute top-4 right-4 select-none">
                <span
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shadow-md",
                    template?.difficulty === "Beginner"
                      ? "bg-blue-500 text-white border-blue-600/30"
                      : template?.difficulty === "Intermediate"
                      ? "bg-yellow-500 text-black border-yellow-600/30"
                      : "bg-red-500 text-white border-red-600/30"
                  )}
                >
                  {template?.difficulty}
                </span>
              </div>
            </div>
            
            <CardHeader className="pt-6 pb-4 space-y-3">
              <CardTitle className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight pt-1">
                {template?.title}
              </CardTitle>

              <CardDescription className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-normal pt-2 border-b border-border/40 pb-6">
                {template?.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 pb-8">
              
              {/* Template Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/50 p-4 rounded-xl border border-border/40">
                
                <div className="space-y-1 text-center sm:text-left border-r border-border/40 sm:pr-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <Clock className="h-3 w-3" /> Duration
                  </span>
                  <p className="text-sm font-bold text-foreground">{template?.duration}</p>
                </div>

                <div className="space-y-1 text-center sm:text-left sm:border-r border-border/40 sm:px-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <ListTodo className="h-3 w-3" /> Task Count
                  </span>
                  <p className="text-sm font-bold text-foreground">{template?.tasksCount} Steps</p>
                </div>

                <div className="space-y-1 text-center sm:text-left border-r border-border/40 pr-4 sm:pl-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" /> Rating
                  </span>
                  <p className="text-sm font-bold text-yellow-600 dark:text-yellow-500">{template?.rating.toFixed(1)} / 5.0</p>
                </div>

                <div className="space-y-1 text-center sm:text-left sm:pl-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="h-3 w-3" /> Released
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {template?.createdAt ? new Date(template.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "N/A"}
                  </p>
                </div>

              </div>

              {/* Quick Template Guidelines Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-primary" /> Learning Roadmap Roadmap Guidelines
                </h4>
                <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <li>This template provides a standardized starting checklist to master the key themes of this program.</li>
                  <li>Clicking the active CTA button below will auto-populate your personal AI Study Planner with the subject parameters.</li>
                  <li>You will be able to customize your preferred study days, learning styles (visual, reading, etc.), and schedule durations before launching the AI-generated plan.</li>
                </ul>
              </div>

              {/* Redirection CTA */}
              <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-3">
                <Link href={getPrefillPlannerUrl()} className="flex-1 sm:flex-initial">
                  <Button size="lg" className="w-full sm:w-auto font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 shadow-md">
                    <Wand2 className="h-4 w-4" />
                    {session ? "Use This Template" : "Start Planning with AI"}
                  </Button>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold">
                    Browse Other Templates
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
          
          {/* Related Study Programs Section */}
          {!isLoading && template && (
            <div className="pt-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/40 pb-4">
                <Sparkles className="h-5.5 w-5.5 text-primary" />
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">Related Study Programs</h3>
              </div>

              {isLoadingRelated ? (
                /* Related templates skeletons */
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse flex flex-col justify-between h-[340px]">
                      <div className="h-40 bg-muted w-full" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-6 bg-muted rounded w-3/4" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : relatedError ? (
                /* Error state for related */
                <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{relatedError}</span>
                  <Button variant="ghost" size="sm" onClick={() => fetchRelated(template.category)} className="ml-auto text-xs py-1 h-auto text-destructive hover:bg-destructive/20">
                    Retry
                  </Button>
                </div>
              ) : related.length === 0 ? (
                /* Empty state */
                <p className="text-xs text-muted-foreground italic">No other related study programs found in this category.</p>
              ) : (
                /* Related Grid */
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {related.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-card border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group rounded-[20px]"
                    >
                      {/* Card Image Banner */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                        {/* Category fallback gradient in background */}
                        <div className={cn("absolute inset-0 bg-gradient-to-br", getCategoryGradient(item.category))} />
                        
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
                        {/* Badges row */}
                        <div className="flex items-center justify-between w-full select-none">
                          <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                            {item.category}
                          </span>
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
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 border-t border-border/40 pt-4">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.duration}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <ListTodo className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.tasksCount} steps
                          </span>
                          <span className="flex items-center gap-0.5 font-bold text-yellow-600 dark:text-yellow-500">
                            <Star className="h-3.5 w-3.5 fill-current text-yellow-500 shrink-0" />
                            {item.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* View details redirection link */}
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
              )}
            </div>
          )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
