"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  BrainCircuit, Calendar, MessageSquare, LineChart, 
  ShieldCheck, ArrowRight, Star, Sparkles, Compass, 
  HelpCircle, ChevronDown, CheckCircle2 
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/public/hero-section";
export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const steps = [
    {
      num: "01",
      title: "Select Your Subject & Goal",
      description: "Define the subject you want to master, specify your target exam date, and outline your learning goals."
    },
    {
      num: "02",
      title: "Generate AI Study Plan",
      description: "Our AI model computes a customized study roadmap, structured phases, and suggested daily study routines."
    },
    {
      num: "03",
      title: "Interact with AI Tutors",
      description: "Ask questions, resolve difficult concepts, and request study assistance anytime from your AI Tutor."
    },
    {
      num: "04",
      title: "Track Progress & Succeed",
      description: "Check off completed study tasks, track your analytics, and optimize recommendations in real-time."
    }
  ];

  const coreModules = [
    {
      icon: Calendar,
      title: "AI Study Planner",
      description: "Build customized learning roadmaps, suggested routines, and structured revision strategies tailored to your timeline."
    },
    {
      icon: MessageSquare,
      title: "AI Tutor Chat",
      description: "Receive 24/7 contextual feedback, study support, and visual code/problem breakdowns from your dedicated tutor."
    },
    {
      icon: Sparkles,
      title: "Personalized Recommendations",
      description: "Discover tailored courses and resource decks aligned dynamically with your task completion velocity."
    },
    {
      icon: LineChart,
      title: "Progress Analytics",
      description: "Track your task completion percentages, active study plan numbers, and performance insights in one console."
    }
  ];

  const faqs = [
    {
      q: "How does the AI Study Planner generate my roadmap?",
      a: "By combining your goal, daily study capacity, current skill level, and exam date, the planner constructs customized phases, distributes tasks evenly, and schedules spaced repetition review blocks to ensure optimal retention."
    },
    {
      q: "Is Better Auth configuration secure?",
      a: "Yes. StudyPilot AI implements top-tier security standards. Authentication is verified cross-origin using session cookies handled exclusively by Next.js and secure CORS policies in the Express API."
    },
    {
      q: "Can I edit my study plans after generating them?",
      a: "Absolutely! You can check/uncheck tasks in your roadmap, update progress status in real-time, and generate additional plans as needed. All modifications are synchronized instantly with the secure backend."
    },
    {
      q: "Is the AI Tutor available at all times?",
      a: "Yes. Your personal AI Tutor chatbot is available 24/7 to explain complex diagrams, write draft summaries, and solve conceptual problems with zero downtime."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. How StudyPilot AI Works Section */}
        <section className="py-20 border-b border-border/55 bg-muted/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight">How StudyPilot AI Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Four simple steps to elevate your retention and conquer complex subjects.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {steps.map((step, idx) => (
                <div key={idx} className="relative p-6 bg-card border border-border/60 rounded-2xl space-y-3 shadow-sm">
                  <div className="text-4xl font-extrabold text-primary/20">{step.num}</div>
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. AI Study Plan Generator Section */}
        <section className="py-20 border-b border-border/55">
          <div className="container max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">AI Study Plan Generator</h2>
              <p className="text-muted-foreground leading-relaxed">
                Say goodbye to generic study plans. Our generator structures tailored learning milestones, distributes estimated task hours evenly, and creates recommended daily routines with active recall slots.
              </p>
              <ul className="space-y-2 text-sm font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  Structured phases from foundations to assessments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  Spaced repetition intervals built-in
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-border/80 aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-8">
              <Calendar className="h-24 w-24 text-primary animate-bounce" />
            </div>
          </div>
        </section>

        {/* 4. AI Tutor Chat Section */}
        <section className="py-20 border-b border-border/55 bg-muted/10">
          <div className="container max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2 space-y-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">AI Tutor Chat Assistant</h2>
              <p className="text-muted-foreground leading-relaxed">
                Stuck on a challenging concept or mathematical derivation? Open an prompt chat with your personal AI Tutor. With deep context awareness, it reviews your current study plan and provides answers tailored to your level.
              </p>
              <ul className="space-y-2 text-sm font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  24/7 conversational assistance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  Preserves context of your active studies
                </li>
              </ul>
            </div>
            <div className="relative md:order-1 rounded-2xl overflow-hidden border border-border/80 aspect-video bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center p-8">
              <MessageSquare className="h-24 w-24 text-accent animate-pulse" />
            </div>
          </div>
        </section>

        {/* 5. Personalized Recommendations Section */}
        <section className="py-20 border-b border-border/55">
          <div className="container max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Personalized Recommendations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Optimize your workflow dynamically. Based on how quickly you check off tasks, StudyPilot AI recommends supporting materials, cheat sheets, and advanced topics to align with your learning speed.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-border/80 aspect-video bg-gradient-to-br from-emerald-500/10 to-primary/10 flex items-center justify-center p-8">
              <Sparkles className="h-24 w-24 text-emerald-500 animate-spin animate-duration-5000" />
            </div>
          </div>
        </section>

        {/* 6. Learning Progress / Analytics Section */}
        <section className="py-20 border-b border-border/55 bg-muted/10">
          <div className="container max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2 space-y-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <LineChart className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Visual Progress Analytics</h2>
              <p className="text-muted-foreground leading-relaxed">
                Stay motivated by monitoring your goals. StudyPilot AI visualizes your study hours, logs recent task completions, and displays task ratios inside a unified analytical dashboard.
              </p>
            </div>
            <div className="relative md:order-1 rounded-2xl overflow-hidden border border-border/80 aspect-video bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center p-8">
              <LineChart className="h-24 w-24 text-secondary" />
            </div>
          </div>
        </section>

        {/* 7. Features Grid Section */}
        <section className="py-20 border-b border-border/55">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Premium Study Modules</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Explore the components that make StudyPilot AI the ultimate companion for modern education.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {coreModules.map((module, idx) => {
                const Icon = module.icon;
                return (
                  <div key={idx} className="p-6 bg-card border border-border/85 rounded-2xl flex flex-col gap-4 shadow-sm animate-out">
                    <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{module.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section className="py-20 border-b border-border/55 bg-muted/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Clear answers to help you get started with the StudyPilot AI platform.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-border/80 rounded-xl bg-card overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === idx && (
                    <div className="p-5 border-t border-border/80 bg-muted/20 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Call To Action (CTA) Section */}
        <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="container max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join thousands of students generating study roadmaps and mastering technical subjects today. Register now and try our AI models.
            </p>
            <div className="flex justify-center">
              <Link href="/register">
                <Button size="lg" className="flex items-center gap-2 group shadow-xl">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
