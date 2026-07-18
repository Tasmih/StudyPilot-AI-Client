import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyPilot AI - Your Ultimate Premium Study Companion",
  description: "StudyPilot AI is a state-of-the-art educational SaaS platform. Generate personalized study roadmaps, chat with AI tutors, and track your academic progress.",
  keywords: "Study, AI Tutor, Education, Learning, SaaS, Study Planner",
  authors: [{ name: "StudyPilot AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastContainer 
            position="bottom-right"
            theme="dark"
            toastClassName="bg-card text-foreground border border-border/50 shadow-xl rounded-lg"
          />
        </Providers>
      </body>
    </html>
  );
}
