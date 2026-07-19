import React from "react";
import { RecentActivity } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, BookOpen, MessageSquare, FileText } from "lucide-react";

interface DashboardActivityProps {
  activities: RecentActivity[];
}

export function DashboardActivity({ activities }: DashboardActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "plan": return <BookOpen className="h-4 w-4 text-primary" />;
      case "chat": return <MessageSquare className="h-4 w-4 text-secondary" />;
      case "item": return <FileText className="h-4 w-4 text-accent" />;
      default: return <History className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-0 shadow-md ring-1 ring-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-foreground">
          <History className="mr-2 h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-10 w-10 text-muted/50 mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-6">
                {index !== activities.length - 1 && (
                  <div className="absolute left-[11px] top-6 w-[2px] h-full bg-border" />
                )}
                <div className="absolute left-0 top-1 h-6 w-6 flex items-center justify-center rounded-full bg-background border ring-2 ring-background">
                  {getIcon(activity.type)}
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-semibold text-foreground leading-none">
                    {activity.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {activity.description}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground/60">
                    {activity.timestamp}
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
