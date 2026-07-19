"use client";

import React from "react";
import { Compass, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ExplorePage() {
  const subjects = [
    {
      title: "Computer Science & Engineering",
      description: "Learn foundational algorithms, system designs, databases, and web frameworks.",
      count: "12 active roadmaps"
    },
    {
      title: "Medical & Health Sciences",
      description: "Master biochemistry, anatomy, clinical pharmacology, and diagnosis methods.",
      count: "8 active roadmaps"
    },
    {
      title: "Mathematics & Statistics",
      description: "Study calculus, linear algebra, probability models, and machine learning mathematical theories.",
      count: "15 active roadmaps"
    },
    {
      title: "Business & Humanities",
      description: "Explore financial analytics, macroeconomics, historical narratives, and creative writing structures.",
      count: "10 active roadmaps"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 container max-w-5xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Compass className="h-8 w-8 md:h-12 md:w-12 text-primary" />
            Explore Study Programs
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover community-curated plans, standardized academic syllabi, and custom-made AI templates.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {subjects.map((subj, idx) => (
            <Card key={idx} className="bg-card/50 backdrop-blur-md border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                    {subj.count}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold mt-2">{subj.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{subj.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="p-0 text-primary hover:text-primary/80 flex items-center gap-1">
                    Select Template <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
