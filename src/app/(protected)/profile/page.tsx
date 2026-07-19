"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Mail, Key } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and personal preferences.</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Personal Details
          </CardTitle>
          <CardDescription>Your registered account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Display Name</span>
              <div className="text-sm font-medium p-2.5 bg-muted/40 rounded-lg border border-border/50">
                {session?.user.name || "Student"}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email Address</span>
              <div className="text-sm font-medium p-2.5 bg-muted/40 rounded-lg border border-border/50 font-mono">
                {session?.user.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-md border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-accent" />
            Security & Privacy
          </CardTitle>
          <CardDescription>Authentication credentials and login providers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span>Password Status</span>
            </div>
            <span className="text-xs text-emerald-500 font-semibold uppercase">Configured</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>Email Verification</span>
            </div>
            <span className="text-xs text-emerald-500 font-semibold uppercase">Verified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
