"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Clock, BookOpen, AlertCircle } from "lucide-react";
import { PlannerResponse } from "@/schemas/planner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PlannerRoadmapProps {
  plan: PlannerResponse;
  onToggleTask?: (taskId: string) => void;
}

export function PlannerRoadmap({ plan, onToggleTask }: PlannerRoadmapProps) {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Roadmap Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <BookOpen className="mr-2 h-5 w-5" />
              Strategic Learning Roadmap
            </CardTitle>
            <CardDescription>Your step-by-step path to mastering the subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {plan.roadmap.map((phase, index) => (
                <div key={index} className="relative pl-6">
                  {/* Vertical line connecting timeline */}
                  {index !== plan.roadmap.length - 1 && (
                    <div className="absolute bottom-0 left-[11px] top-6 w-0.5 bg-border" />
                  )}
                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-background bg-primary" />
                  <div className="mb-2 font-semibold text-lg text-foreground">{phase.phaseName}</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {phase.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex flex-col rounded-lg border p-3 transition-colors ${
                          task.completed ? "bg-muted/10 border-border/40 opacity-75" : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 max-w-[80%]">
                            {onToggleTask && (
                              <button
                                onClick={() => onToggleTask(task.id)}
                                className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                  task.completed 
                                    ? "bg-emerald-500 border-emerald-500 text-white" 
                                    : "border-muted-foreground hover:border-foreground bg-background"
                                }`}
                                aria-label={`Toggle completion of task: ${task.title}`}
                              >
                                {task.completed && (
                                  <svg className="h-3 w-3 fill-none stroke-current stroke-[3px]" viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            )}
                            <span className={`font-medium text-sm truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {task.title}
                            </span>
                          </div>
                          <span className="flex items-center text-xs font-medium text-secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            {task.estimatedHours}h
                          </span>
                        </div>
                        <p className={`text-xs ${task.completed ? "line-through text-muted-foreground/60" : "text-muted-foreground"}`}>
                          {task.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Daily Schedule Section */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-0 shadow-lg ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-secondary">
                <Clock className="mr-2 h-5 w-5" />
                Suggested Daily Routine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.dailySchedule.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="mr-3 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revision Strategy Section */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-0 shadow-lg ring-1 ring-border/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-accent">
                <AlertCircle className="mr-2 h-5 w-5" />
                Revision Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {plan.revisionStrategy}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
