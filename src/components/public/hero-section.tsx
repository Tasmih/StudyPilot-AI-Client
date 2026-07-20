"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BrainCircuit, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Master Any Subject with Intelligent AI",
    description:
      "StudyPilot AI generates personalized learning roadmaps tailored precisely to your goals, current skill level, and schedule.",
    icon: BrainCircuit,
  },
  {
    id: 2,
    title: "Your 24/7 Personal AI Tutor",
    description:
      "Stuck on a complex concept? Chat instantly with our AI tutor for clear explanations, step-by-step guidance, and follow-up reasoning.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Track Progress & Crush Exams",
    description:
      "Transform overwhelming syllabuses into manageable daily tasks. Monitor your study analytics and hit your target scores with confidence.",
    icon: Target,
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden bg-background pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Decorative Background gradient */}
      <div className="absolute inset-0 z-0 bg-background-image-gradient-primary opacity-[0.03]" />
      
      <div className="container relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col space-y-4"
            >
              <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit">
                {React.createElement(slides[currentSlide].icon, { className: "h-4 w-4" })}
                <span>StudyPilot AI Innovation</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {slides[currentSlide].title}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Slider Indicators */}
          <div className="flex items-center space-x-2 pt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Abstract AI Dashboard Illustration using Framer Motion */}
        <div className="relative mx-auto flex h-[400px] w-full max-w-[500px] items-center justify-center lg:ml-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-secondary/20 to-transparent blur-3xl" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-accent/60" />
              </div>
              <div className="h-4 w-24 rounded-full bg-muted/50" />
            </div>
            <div className="flex flex-1 flex-col space-y-4 pt-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-1/2 rounded-md bg-muted/40" />
                <div className="h-6 w-16 rounded-full bg-primary/10" />
              </div>
              
              {/* Progress Card */}
              <div className="flex flex-col space-y-3 rounded-xl border bg-background/50 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-24 rounded bg-muted-foreground/30" />
                    <div className="h-2 w-full max-w-[8rem] rounded bg-muted/40" />
                  </div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
              </div>

              {/* Grid of smaller stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col space-y-2 rounded-xl border bg-background/50 p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-secondary" />
                    <div className="h-3 w-16 rounded bg-muted-foreground/30" />
                  </div>
                  <div className="h-6 w-12 rounded bg-foreground/10" />
                </div>
                <div className="flex flex-col space-y-2 rounded-xl border bg-background/50 p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <div className="h-3 w-16 rounded bg-muted-foreground/30" />
                  </div>
                  <div className="h-6 w-12 rounded bg-foreground/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
