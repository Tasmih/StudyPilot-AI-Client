import type { Metadata } from "next";

import "./globals.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
      <body>
        <Providers>
          {children}
          <ToastContainer 
            position="bottom-right"
            theme="light"
            toastClassName="!bg-card !text-foreground !border !border-border/80 !shadow-lg !rounded-xl !font-sans"
          />
        </Providers>
      </body>
    </html>
  );
}
