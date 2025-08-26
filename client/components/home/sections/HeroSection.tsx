import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Brain, BarChart3, Shield, MessageCircle, Award, Sparkles, Play, ArrowRight, Star } from "lucide-react";
import BackgroundCarousel from "../ui/BackgroundCarousel";
import RotatingHeader from "../ui/RotatingHeader";
import RotatingText from "../ui/RotatingText";

export default function HeroSection() {
  // Enhanced floating cards data with better animations
  const floatingCards = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student Management",
      color: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-700",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Grading",
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-700",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics",
      color: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      color: "bg-gradient-to-br from-red-50 to-red-100",
      textColor: "text-red-700",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Communication",
      color: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      textColor: "text-yellow-700",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certifications",
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      textColor: "text-indigo-700",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/50">
      {/* Enhanced Background with Mesh Gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5 dark:opacity-10"></div>
      
      {/* Enhanced Floating Background Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCards.map((card, index) => (
          <div
            key={index}
            className={`absolute ${card.color} rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 card-elevated`}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 10}%`,
              animationDelay: `${index * 2}s`,
              animationDuration: `${8 + index}s`,
              opacity: 0.15,
            }}
          >
            <div className={`flex items-center gap-3 ${card.textColor}`}>
              <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm">
                {card.icon}
              </div>
              <span className="font-semibold text-sm">{card.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Hero Content */}
      <section className="container max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32 text-center relative z-10">
        <BackgroundCarousel />
        
        {/* Enhanced Content Container */}
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          
          {/* Trust Badge */}
          <div className="animate-in fade-in duration-700 delay-100">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Trusted by 1000+ Educational Institutes</span>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <RotatingHeader />
          </div>

          {/* Enhanced Description */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-balance">
              Harness the power of{" "}
              <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                artificial intelligence
              </span>{" "}
              to <RotatingText /> and scale your institute with intelligent
              insights and{" "}
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                data-driven growth
              </span>
              .
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="animate-in fade-in scale-in duration-700 delay-500">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link to="/get-started">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 md:px-10 py-4 text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto font-semibold rounded-2xl border-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Sparkles className="w-5 md:w-6 h-5 md:h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight className="w-5 md:w-6 h-5 md:h-6 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-8 md:px-10 py-4 text-lg md:text-xl hover:shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto font-semibold bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl hover:bg-white dark:hover:bg-slate-800"
              >
                <Play className="w-5 md:w-6 h-5 md:h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Button>
            </div>
          </div>

          {/* Enhanced Trust Badges with Better Design */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 px-4">
              {[
                { icon: Shield, label: "AI-Secure", color: "emerald" },
                { icon: Sparkles, label: "Smart Automation", color: "blue" },
                { icon: Brain, label: "ML-Powered", color: "purple" },
                { icon: Users, label: "Predictive Analytics", color: "orange" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`group flex items-center gap-2 text-${badge.color}-700 font-semibold bg-gradient-to-br from-${badge.color}-50 to-${badge.color}-100 px-4 py-3 rounded-2xl border border-${badge.color}-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm cursor-default card-elevated`}
                >
                  <badge.icon className={`w-4 md:w-5 h-4 md:h-5 group-hover:scale-110 transition-transform duration-300`} />
                  <span className="text-sm sm:text-base whitespace-nowrap">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Stats Preview */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-900">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              {[
                { number: "1000+", label: "Active Users" },
                { number: "50+", label: "Institutes" },
                { number: "95%", label: "Satisfaction" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 card-elevated"
                >
                  <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
