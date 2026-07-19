"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  Compass, 
  Wand2, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  LineChart 
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    {
      icon: <Wand2 className="h-6 w-6 text-primary" />,
      title: "AI-Powered Study Planning",
      description: "Generate structured, phased roadmaps customized to your weak topics, learning style, and exam timeline."
    },
    {
      icon: <Compass className="h-6 w-6 text-secondary" />,
      title: "Curated Academic Catalogs",
      description: "Browse 100+ standardized study templates matching key subjects in Computer Science, Business, and Science."
    },
    {
      icon: <Clock className="h-6 w-6 text-accent" />,
      title: "Task-Based Roadmap Management",
      description: "Review clear step-by-step milestones, check off completed study targets, and stay on top of daily routines."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "Secure Personal Storage",
      description: "Your study plans and progress belong entirely to you, secured behind robust authentication and session controls."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Explore the Catalog",
      description: "Select from pre-constructed templates in Computer Science, Math, Business, or Medical fields."
    },
    {
      num: "02",
      title: "Personalize with AI",
      description: "Input your target exam date, current skill level, weak concepts, and weekly availability."
    },
    {
      num: "03",
      title: "Build the Roadmap",
      description: "Our AI constructs a daily checklist, active revision guidelines, and structured phases."
    },
    {
      num: "04",
      title: "Track Your Progress",
      description: "Check off tasks, monitor your plan progress percentage, and conquer your exams."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="container max-w-5xl mx-auto px-4 relative text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen Learning Platform
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Supercharge Your Academic Preparation with{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                StudyPilot AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Transform broad syllabus checklists into customized study timetables. Plan daily routines, focus on weak topics, and track progress securely.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/explore">
                <Button size="lg" className="w-full sm:w-auto font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 shadow-md">
                  <Compass className="h-5 w-5" /> Explore Study Templates
                </Button>
              </Link>
              <Link href="/planner">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold flex items-center justify-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" /> Create Your Study Plan
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Core Value Proposition Section */}
        <section className="py-16 md:py-24 container max-w-5xl mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-12 md:grid-cols-2 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                What is StudyPilot AI?
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                StudyPilot AI was designed to solve a core problem in modern higher education: **information overload**. 
                Students are frequently faced with vast, complex academic curricula and struggle to pace their exam preparation effectively.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Our platform lets you browse community-sourced catalog guidelines, and uses agentic AI reasoning to structure phased timelines matching your capacity, targets, and study styles.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Paced Timelines</h4>
                    <p className="text-xs text-muted-foreground">Phased roadmaps for steady learning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Tailored Focus</h4>
                    <p className="text-xs text-muted-foreground">Prioritize weak topics dynamically.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative aspect-video rounded-[20px] bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/5 border border-border p-6 flex flex-col justify-center items-center text-center shadow-inner">
              <Sparkles className="h-16 w-16 text-primary mb-4 animate-pulse" />
              <h3 className="font-bold text-lg text-foreground">Intelligent Roadmap Construction</h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-2 leading-relaxed">
                Our scheduler maps active retrieval cycles, revision intervals, and task lists suited to your constraints.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works (Phases Section) */}
        <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
          <div className="container max-w-5xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                How StudyPilot AI Works
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Follow our 4-step workflow to generate and master your customized learning program.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {steps.map((step, idx) => (
                <Card key={idx} className="bg-card border border-border/80 shadow-sm relative overflow-hidden group hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <span className="text-3xl font-black text-primary/10 group-hover:text-primary/20 transition-colors absolute top-3 right-4 select-none">
                      {step.num}
                    </span>
                    <CardTitle className="text-base font-bold text-foreground pt-3">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-16 md:py-24 container max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Key Platform Features
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              We focus on core features designed to assist study workflows and maximize learning retention.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feat, idx) => (
              <Card key={idx} className="border border-border/60 bg-card/40 backdrop-blur-md flex gap-4 p-5 items-start">
                <div className="p-3 rounded-lg bg-background border border-border/60 shrink-0">
                  {feat.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-foreground">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Security & Access Section */}
        <section className="py-16 md:py-24 bg-muted/40 border-t border-border/50">
          <div className="container max-w-4xl mx-auto px-4">
            <Card className="border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-bold text-lg text-foreground flex items-center justify-center md:justify-start gap-2">
                  Privacy and Secure Account Access
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Your generated study schedules, dashboard tasks, and roadmap items are completely private. Better Auth session cookies verify access, ensuring that other accounts cannot view or modify your data.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 text-center container max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Take Control of Your Study Goals?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Choose an existing subject roadmap template or generate an adaptive AI plan from scratch now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/explore">
              <Button size="lg" className="w-full sm:w-auto font-bold bg-primary text-primary-foreground hover:bg-primary/95 shadow-md">
                Browse Templates
              </Button>
            </Link>
            <Link href="/planner">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold">
                Start Planning
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
