"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Library, RefreshCw } from "lucide-react";

export default function RecommendationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Personalized Recommendations
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered suggestions to optimize your learning efficiency.</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Library className="h-5 w-5 text-accent" />
            Recommended Courses & Materials
          </CardTitle>
          <CardDescription>Suggested study plans and topics based on your planner history.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <p>
            Our recommendation engine analyzes your active study plans and task completion speed to highlight areas needing revision.
          </p>
          <div className="p-4 bg-muted/40 rounded-lg border border-border/50 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
            <div>
              <div className="font-semibold text-foreground">Analyzing progress patterns...</div>
              <div className="text-xs">Recommendations will refresh automatically as you check off tasks.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
