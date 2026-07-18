import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background pt-12 pb-8">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
        {/* Brand */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">StudyPilot AI</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your personalized AI study companion for achieving academic success. 
            Plan, learn, and conquer your exams with intelligent assistance.
          </p>
          <div className="flex space-x-4 pt-2">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaTwitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaLinkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>

        {/* Product Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Product</h4>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/planner" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                AI Study Planner
              </Link>
            </li>
            <li>
              <Link href="/assistant" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                AI Tutor Chat
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Legal</h4>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} StudyPilot AI. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for modern education.</p>
      </div>
    </footer>
  );
}
