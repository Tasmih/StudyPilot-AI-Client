"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ShieldCheck, AlertCircle, Key, Server, RefreshCw } from "lucide-react";

export default function AuthTestPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBackendAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth-test", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setResponse(data);
      if (!res.ok) {
        setError(data.message || `HTTP error! Status: ${res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to make fetch request to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Authentication Diagnostics
        </h1>
        <p className="text-muted-foreground">
          Validate Next.js Better Auth session forwarding and Express backend token verification.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Frontend Session Info */}
        <Card className="bg-card/50 backdrop-blur-md border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5 text-accent" />
              Frontend Session (Next.js)
            </CardTitle>
            <CardDescription>
              Current session data from Better Auth Client SDK
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSessionPending ? (
              <div className="flex items-center justify-center p-6">
                <Loading size="md" />
              </div>
            ) : session ? (
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">User</div>
                  <div className="text-sm font-medium">{session.user.name || "No name"}</div>
                  <div className="text-xs text-muted-foreground font-mono">{session.user.email}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Session ID</div>
                  <div className="text-xs font-mono break-all">{session.session.id}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Frontend Authenticated
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">
                  No active Next.js session detected.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backend Diagnostic Trigger */}
        <Card className="bg-card/50 backdrop-blur-md border-border/80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5 text-primary" />
              Backend Test Client (Express)
            </CardTitle>
            <CardDescription>
              Test session forwarding to the Express endpoint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
            <div className="text-sm text-muted-foreground mb-4">
              Sends a request to <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground">GET http://localhost:5000/api/auth-test</code> with <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-foreground">credentials: "include"</code>.
            </div>
            <Button
              onClick={testBackendAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
              variant="primary"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                "Run Diagnostics"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* JSON Response Visualization */}
      <Card className="bg-card/50 backdrop-blur-md border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-lg">Response Output</CardTitle>
            <CardDescription>Backend API verification response payload</CardDescription>
          </div>
          {response && (
            <div className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
              response.success 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${response.success ? 'bg-emerald-500' : 'bg-destructive'}`} />
              {response.success ? "HTTP 200 OK" : "Verification Failed"}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold">Diagnostic Error</div>
                <div className="text-xs font-mono mt-1 break-all">{error}</div>
              </div>
            </div>
          )}

          {response ? (
            <div className="relative">
              <pre className="p-4 bg-muted/80 rounded-lg overflow-x-auto text-xs font-mono border border-border/60 text-foreground leading-relaxed">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="border border-dashed border-border/80 rounded-lg p-8 text-center text-muted-foreground text-sm">
              No diagnostic has been run yet. Click "Run Diagnostics" to fetch auth status.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
