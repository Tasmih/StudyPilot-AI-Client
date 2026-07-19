"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General Support");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  
  // Honeypot anti-spam field state (will be hidden from human users)
  const [website, setWebsite] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const faqItems = [
    {
      q: "Can I customize my study plan after it is generated?",
      a: "Yes! While the AI generates a baseline roadmap, you can check off completed items, delete individual plans, or configure different durations and priorities on regeneration."
    },
    {
      q: "How does the AI construct the study phases?",
      a: "Our system prompts the Gemini API to analyze your exam date and daily hours. It groups the required study load into logical sequential blocks (e.g. foundation, advanced, practice)."
    },
    {
      q: "Is my personal dashboard data private?",
      a: "Absolutely. All created study roadmaps and details are stored securely in MongoDB and only returned if they match your authenticated user ID session."
    },
    {
      q: "What is the typical response time for support requests?",
      a: "Our support team actively monitors submissions and aims to respond within 24 to 48 business hours."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Human checks / validations
    if (name.trim().length < 2) {
      setErrorMsg("Name must be at least 2 characters long.");
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (subject.trim().length < 3) {
      setErrorMsg("Subject must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg("Message must be at least 10 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<{ success: boolean; message: string }>("/api/support", {
        name,
        email,
        subject,
        category: `${category} (Priority: ${priority})`,
        message,
        website, // honeypot spam input
      });

      if (response.success) {
        setSuccessMsg(response.message || "Support ticket submitted successfully.");
        // Clear form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setWebsite("");
      } else {
        setErrorMsg(response.message || "Failed to submit request.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow py-12 md:py-16 container max-w-5xl mx-auto px-4 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            Have questions about StudyPilot AI templates, AI roadmaps, or technical errors? Get in touch with our team.
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="bg-card/50 border border-border/80 p-5 space-y-3 text-center">
            <div className="p-3 bg-primary/10 text-primary w-fit mx-auto rounded-full">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm">General Inquiries</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Questions regarding study planner parameters, subscription details, or community templates.
            </p>
          </Card>
          <Card className="bg-card/50 border border-border/80 p-5 space-y-3 text-center">
            <div className="p-3 bg-secondary/10 text-secondary w-fit mx-auto rounded-full">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm">Technical Support</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Encountering rendering issues, template loading delays, or database authentication errors?
            </p>
          </Card>
          <Card className="bg-card/50 border border-border/80 p-5 space-y-3 text-center">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 w-fit mx-auto rounded-full">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm">Trust & Security</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Audit support related to account access session controls and personal dataset queries.
            </p>
          </Card>
        </div>

        {/* Contact Form and FAQ Split Layout */}
        <div className="grid gap-8 md:grid-cols-12">
          
          {/* Support Form Container */}
          <div className="md:col-span-7 space-y-4">
            <Card className="border border-border/80 bg-card/60 backdrop-blur-md p-6 shadow-sm">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Submit a Ticket</CardTitle>
                <CardDescription className="text-xs">
                  Fill in the details below and we will route your inquiry to the correct specialist.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                
                {successMsg && (
                  <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs md:text-sm flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Message Sent!</p>
                      <p className="mt-0.5 leading-relaxed">{successMsg}</p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs md:text-sm flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Submission Failed</p>
                      <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot hidden input field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Leave this empty"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Full Name</label>
                      <Input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Email Address</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Category</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="General Support">General Support</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Feedback / Suggestions">Feedback & Suggestions</option>
                        <option value="Partnership / Business">Partnership / Business Inquiry</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Priority</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none cursor-pointer"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        disabled={isLoading}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Subject</label>
                    <Input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary of your inquiry"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Message</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please details your request so we can assist you properly..."
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 font-bold py-3"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQs Container */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Before reaching out, check whether your question has already been answered.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <h4 className="font-bold text-sm text-foreground flex items-start gap-1.5">
                    <span className="text-primary font-black">Q:</span> {item.q}
                  </h4>
                  <p className="text-xs text-muted-foreground pl-4 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Redirection guidelines */}
            <div className="border-t border-border pt-6 space-y-3">
              <h4 className="font-bold text-sm text-foreground">Useful Resources</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/explore" className="text-primary hover:underline flex items-center gap-1">
                    Browse Standard Catalog Templates <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/planner" className="text-primary hover:underline flex items-center gap-1">
                    Manage My Study Plans Dashboard <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
