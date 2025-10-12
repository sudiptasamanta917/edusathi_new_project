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
import CourseVideos from "@/components/home/sections/CourseVideos";
import TrendingVideos from "@/components/home/sections/TrendingVideos";
import AllVideos from "@/components/home/sections/AllVideos";

export default function Index() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/50 relative overflow-hidden">
          {/* decorative backgrounds removed */}

          <div className="relative z-10 [&_.container]:px-2 sm:[&_.container]:px-3">
              <Navbar />

              <main className="">
                  <EnhancedHeroSection />
                  <ValueProposition />
                  <AllVideos />
                  <TrendingVideos />
                  <CourseVideos />
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
