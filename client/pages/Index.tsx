import React, { useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EnhancedHeroSection from "@/components/home/sections/EnhancedHeroSection";
import ValueProposition from "@/components/home/sections/ValueProposition";
import Features from "@/components/home/sections/Features";
import Stats from "@/components/home/sections/Stats";
import Testimonials from "@/components/home/sections/Testimonials";
import AboutSection from "@/components/home/sections/AboutSection";
import FAQ from "@/components/home/sections/FAQ";
import ContactSection from "@/components/home/sections/ContactSection";
import FinalCTA from "@/components/home/sections/FinalCTA";

export default function Index() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 bg-mesh-gradient opacity-5 dark:opacity-10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-purple-400/10 pointer-events-none"></div>
      
      {/* Floating Background Orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "2s" }}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-400/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "4s" }}></div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main>
          <EnhancedHeroSection />
          <ValueProposition />
          <Features />
          <Stats />
          <Testimonials />
          <AboutSection />
          <FAQ />
          <ContactSection />
          <FinalCTA />
        </main>

        <Footer />
        
        <LoginModal 
          open={isLoginModalOpen} 
          onOpenChange={setIsLoginModalOpen} 
        />
        <CookieConsentBanner />
      </div>
    </div>
  );
}
