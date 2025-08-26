import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Star, 
  Shield, 
  Brain, 
  Users, 
  BarChart3,
  Zap,
  Award,
  Globe,
  Clock,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target
} from 'lucide-react';

export default function EnhancedHeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Enhanced floating elements with more variety
  const floatingElements = [
    { icon: <Brain className="w-5 h-5" />, text: "AI-Powered Learning", delay: 0, position: "top-1/4 left-1/4" },
    { icon: <Users className="w-5 h-5" />, text: "Smart Management", delay: 1, position: "top-1/3 right-1/4" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "Advanced Analytics", delay: 2, position: "bottom-1/3 left-1/5" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Platform", delay: 3, position: "bottom-1/4 right-1/3" },
    { icon: <Zap className="w-5 h-5" />, text: "Lightning Fast", delay: 4, position: "top-1/2 left-1/6" },
    { icon: <Award className="w-5 h-5" />, text: "Certified Quality", delay: 5, position: "top-2/3 right-1/5" },
  ];

  // Rotating text options
  const rotatingTexts = [
    "revolutionize education",
    "streamline operations", 
    "boost student engagement",
    "enhance learning outcomes",
    "automate administrative tasks",
    "drive institutional growth"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced stats with better visuals
  const stats = [
    { number: "10K+", label: "Active Students", icon: <Users className="w-4 h-4" /> },
    { number: "500+", label: "Institutions", icon: <Globe className="w-4 h-4" /> },
    { number: "99.9%", label: "Uptime", icon: <Clock className="w-4 h-4" /> },
    { number: "95%", label: "Satisfaction", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // Enhanced feature highlights
  const features = [
    { icon: <BookOpen className="w-5 h-5" />, text: "Smart Course Management", color: "blue" },
    { icon: <Lightbulb className="w-5 h-5" />, text: "AI-Driven Insights", color: "purple" },
    { icon: <Target className="w-5 h-5" />, text: "Personalized Learning", color: "emerald" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/50">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-indigo-500/10 dark:from-blue-400/20 dark:via-purple-400/10 dark:to-indigo-400/20 animate-pulse"></div>
        
        {/* Floating orbs with better positioning */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-float opacity-60" style={{ animationDelay: "4s" }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] opacity-20"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} opacity-30 dark:opacity-50`}
            style={{
              animationDelay: `${element.delay}s`,
              animation: `float 8s ease-in-out infinite`,
            }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 dark:border-slate-700/50">
              <div className="text-blue-600 dark:text-blue-400">
                {element.icon}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {element.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <section className="container max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32 text-center relative z-10">
        
        {/* Enhanced Trust Badge */}
        <div className="animate-in fade-in duration-700 delay-100 mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Trusted by 1000+ Educational Institutes Worldwide
            </span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Main Heading */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="block bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">
              Transform Education
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              with AI Innovation
            </span>
          </h1>
        </div>

        {/* Enhanced Description with Rotating Text */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 mb-12">
          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-5xl mx-auto leading-relaxed">
            Harness the power of{" "}
            <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              artificial intelligence
            </span>{" "}
            to{" "}
            <span className="inline-block min-w-[280px] text-left">
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {rotatingTexts[activeIndex]}
              </span>
            </span>{" "}
            and drive your institution towards excellence.
          </p>
        </div>

        {/* Enhanced Feature Highlights */}
        <div className="animate-in fade-in scale-in duration-700 delay-400 mb-12">
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-${feature.color}-50 to-${feature.color}-100 dark:from-${feature.color}-900/30 dark:to-${feature.color}-800/30 border border-${feature.color}-200/50 dark:border-${feature.color}-700/50 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default`}
              >
                <div className={`text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <span className={`font-semibold text-${feature.color}-700 dark:text-${feature.color}-300 text-sm sm:text-base`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="animate-in fade-in scale-in duration-700 delay-500 mb-16">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/get-started">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 w-full sm:w-auto font-bold rounded-2xl border-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <Sparkles className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-10 py-6 text-xl hover:shadow-xl transition-all duration-500 hover:scale-110 w-full sm:w-auto font-bold bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Play className="w-6 h-6 mr-3 relative z-10 group-hover:scale-125 transition-transform duration-300" />
              <span className="relative z-10">Watch Demo</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group p-6 rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-default"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-900 mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Join thousands of educators who are already transforming education with our AI-powered platform
            </p>
            <div className="flex justify-center">
              <Link to="/get-started">
                <Button
                  variant="ghost"
                  className="group text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-lg underline decoration-2 underline-offset-4 hover:underline-offset-8 transition-all duration-300"
                >
                  Explore All Features
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}