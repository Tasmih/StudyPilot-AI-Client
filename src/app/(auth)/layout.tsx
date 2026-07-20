import { ReactNode } from "react";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute top-8 flex items-center justify-center w-full">
        <Link href="/" className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight text-foreground">StudyPilot AI</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3500} 
        theme="light" 
        toastClassName="!bg-card !text-foreground !border !border-border/80 !shadow-lg !rounded-xl !font-sans"
      />
    </div>
  );
}
