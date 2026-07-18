import React from "react";
import { DashboardStats as StatsType } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock, MessageSquare } from "lucide-react";

interface DashboardStatsProps {
  stats: StatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Study Plans",
      value: stats.totalStudyPlans,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Study Hours",
      value: stats.studyHours,
      icon: Clock,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "AI Conversations",
      value: stats.aiConversations,
      icon: MessageSquare,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-0 shadow-md ring-1 ring-border/50">
            <CardContent className="flex items-center p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bg} ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
