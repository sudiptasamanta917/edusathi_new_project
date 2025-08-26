import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-slate-200/50 dark:border-slate-700/50' 
        : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-slate-200/30 dark:border-slate-700/30'
    }`}>
      <div className="container max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent font-display">
              Edusathi
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {[
              { to: "/creator", label: "Creator" },
              { to: "/business", label: "For Business" },
              { to: "/student", label: "For Students" },
              { to: "/about", label: "About us" },
              { to: "/contact", label: "Contact us" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 font-medium group rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-8 group-hover:left-1/2 transform -translate-x-1/2"></span>
              </Link>
            ))}
          </nav>

          {/* Enhanced Desktop CTA & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/get-started" className="hidden sm:block">
              <Button className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl font-semibold group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="w-4 h-4 mr-2 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Join Now</span>
              </Button>
            </Link>
            
            {/* Enhanced Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100 mt-4 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
            <nav className="flex flex-col space-y-1">
              {[
                { to: "/creator", label: "Creator" },
                { to: "/business", label: "For Business" },
                { to: "/student", label: "For Students" },
                { to: "/catalog", label: "Catalog" },
                { to: "/about", label: "About us" },
                { to: "/contact", label: "Contact us" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 font-medium py-3 px-4 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Enhanced Mobile CTA */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-4">
              <Link to="/get-started" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold group">
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
