import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edusathi
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              All-in-one AI-powered platform for institutes. Take your
              institute online and grow with confidence.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300 hover:shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/50 hover:text-sky-600 dark:hover:text-sky-400 hover:scale-110 transition-all duration-300 hover:shadow-lg"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300 hover:shadow-lg"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/50 hover:text-pink-600 dark:hover:text-pink-400 hover:scale-110 transition-all duration-300 hover:shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Product</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Integrations
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                API
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                About us
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Careers
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Legal</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                GDPR
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            © 2025 Edusathi. All rights reserved. Made with ❤️ for educators
            worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
