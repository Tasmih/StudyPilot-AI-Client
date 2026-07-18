import React from "react";
import { AIInsight } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb, TrendingUp, Brain } from "lucide-react";
import { cn } from "@/utils/cn";

interface DashboardInsightsProps {
  insights: AIInsight[];
}

export function DashboardInsights({ insights }: DashboardInsightsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "suggestion": return <Lightbulb className="h-5 w-5 text-secondary" />;
      case "tip": return <TrendingUp className="h-5 w-5 text-accent" />;
      case "recommendation": return <Brain className="h-5 w-5 text-primary" />;
      default: return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="border-0 shadow-md ring-1 ring-border/50 h-full bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-primary">
          <Sparkles className="mr-2 h-5 w-5" />
          AI Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">Study more to generate personalized insights.</p>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={cn(
                  "flex items-start gap-3 rounded-lg border bg-background/50 p-4 shadow-sm",
                  insight.impact === "high" && "border-primary/30 bg-primary/10"
                )}
              >
                <div className="shrink-0 pt-0.5">
                  {getIcon(insight.type)}
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {insight.type}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {insight.content}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
