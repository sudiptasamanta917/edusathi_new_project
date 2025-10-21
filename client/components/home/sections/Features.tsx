// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Brain, BarChart3, Users, TrendingUp, Shield, Award, ArrowRight, Zap } from "lucide-react";

// export default function Features() {
//   const features = [
//     {
//       icon: <Brain className="w-12 h-12" />,
//       title: "AI-powered grading & personalized learning paths",
//       description: "Automated assessment with personalized recommendations for each student's unique learning journey",
//       color: "blue",
//       gradient: "from-blue-500 to-cyan-500",
//       bgGradient: "from-blue-50 to-cyan-50",
//     },
//     {
//       icon: <BarChart3 className="w-12 h-12" />,
//       title: "Real-time performance analytics dashboards",
//       description: "Track student progress, engagement, and institutional performance with comprehensive insights",
//       color: "emerald",
//       gradient: "from-emerald-500 to-teal-500",
//       bgGradient: "from-emerald-50 to-teal-50",
//     },
//     {
//       icon: <Users className="w-12 h-12" />,
//       title: "Quick staff onboarding",
//       description: "Guided dashboards to get your team up and running fast with intuitive workflows",
//       color: "purple",
//       gradient: "from-purple-500 to-indigo-500",
//       bgGradient: "from-purple-50 to-indigo-50",
//     },
//     {
//       icon: <TrendingUp className="w-12 h-12" />,
//       title: "Growth Analytics",
//       description: "Data-driven insights to scale your institute effectively with predictive modeling",
//       color: "orange",
//       gradient: "from-orange-500 to-red-500",
//       bgGradient: "from-orange-50 to-red-50",
//     },
//     {
//       icon: <Shield className="w-12 h-12" />,
//       title: "Security & compliance",
//       description: "Enterprise-grade security with privacy-first approach and regulatory compliance",
//       color: "red",
//       gradient: "from-red-500 to-pink-500",
//       bgGradient: "from-red-50 to-pink-50",
//     },
//     {
//       icon: <Award className="w-12 h-12" />,
//       title: "Certification Management",
//       description: "Issue and track digital certificates and achievements with blockchain verification",
//       color: "indigo",
//       gradient: "from-indigo-500 to-purple-500",
//       bgGradient: "from-indigo-50 to-purple-50",
//     },
//   ];

//   return (
//     <section id="features" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgb(15,23,42),rgba(15,23,42,0.6))] opacity-50"></div>
      
//       <div className="container max-w-7xl mx-auto px-4 relative z-10">
//         {/* Enhanced Section Header */}
//         <div className="text-center mb-16 md:mb-20 space-y-6">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border border-blue-200/50 dark:border-blue-700/50 mb-4">
//             <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Powerful Features</span>
//           </div>
          
//           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight text-balance">
//             Everything you need for
//             <br />
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
//               modern education
//             </span>
//           </h2>
          
//           <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed text-balance">
//             Transform your educational institute with our comprehensive suite of AI-powered tools and analytics
//           </p>
//         </div>

//         {/* Enhanced Features Grid */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="group animate-in fade-in slide-in-from-bottom-8 duration-700"
//               style={{ animationDelay: `${index * 150}ms` }}
//             >
//               <Card className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/60 transition-all duration-300 h-full bg-white dark:bg-slate-800 hover:scale-[1.02] hover:-translate-y-1 interactive cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 dark:focus-visible:ring-slate-600">
//                 {/* Accent bar */}
//                 <div className={`absolute inset-x-0 top-0 h-1 bg-${feature.color}-500/70`}></div>

//                 <CardHeader className="relative z-10 pb-4">
//                   {/* Enhanced Icon Container */}
//                   <div className={`mb-6 relative inline-flex p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 transition-all duration-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600`}>
//                     <div className={`text-${feature.color}-500 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-500`}>
//                       {feature.icon}
//                     </div>
//                   </div>
                  
//                   {/* Enhanced Title */}
//                   <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 text-balance">
//                     {feature.title}
//                   </CardTitle>
//                 </CardHeader>
//                 {/* Divider */}
//                 <div className="h-px w-full bg-slate-100 dark:bg-slate-700"></div>
                
//                 <CardContent className="relative z-10">
//                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
//                     {feature.description}
//                   </p>
                  
//                   {/* Learn More Link */}
//                   <div className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 cursor-pointer">
//                     <span>Learn more</span>
//                     <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
//                   </div>
//                 </CardContent>

//                 {/* Decorative light effects removed */}
//               </Card>
//             </div>
//           ))}
//         </div>

//         {/* Enhanced CTA Section */}
//         <div className="text-center mt-16 md:mt-20">
//           <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-100/50 dark:border-blue-700/30 backdrop-blur-sm">
//             <div className="text-center sm:text-left">
//               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
//                 Ready to transform your institute?
//               </h3>
//               <p className="text-slate-600 dark:text-slate-400">
//                 Join thousands of educators already using our platform
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
//                 Get Started Free
//               </button>
//               <button className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 bg-white dark:bg-slate-800">
//                 Schedule Demo
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import {
    Brain,
    BarChart3,
    Users,
    TrendingUp,
    Award,
    ArrowRight,
    Zap,
    LucideIcon,
} from "lucide-react";

type Feature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

const blobStyles: string[] = [
    "border-radius: 66% 34% 61% 39% / 35% 67% 33% 65%;", // AI Grading
    "border-radius: 41% 59% 55% 45% / 54% 33% 67% 46%;", // Analytics
    "border-radius: 72% 28% 47% 53% / 60% 40% 56% 40%;", // Onboarding
    "border-radius: 60% 40% 37% 63% / 47% 58% 42% 53%;", // Growth
    "border-radius: 50% 50% 70% 30% / 55% 45% 75% 25%;", // Certificates
];

const features: Feature[] = [
    {
        icon: Brain,
        title: "AI Grading",
        description:
            "Automated assessment with personalized recommendations for each student's unique learning journey",
    },
    {
        icon: BarChart3,
        title: "Analytics",
        description:
            "Track student progress, engagement, and institutional performance with comprehensive insights",
    },
    {
        icon: Users,
        title: "Onboarding",
        description:
            "Guided dashboards to get your team up and running fast with intuitive workflows",
    },
    {
        icon: TrendingUp,
        title: "Growth",
        description:
            "Data-driven insights to scale your institute effectively with predictive modeling",
    },
    {
        icon: Award,
        title: "Certificates",
        description:
            "Issue and track digital certificates and achievements with blockchain verification",
    },
];

// Type-safe helper
function parseBorderRadius(css: string): React.CSSProperties {
    const match = css.match(/border-radius: ([^;]+);/);
    return match ? { borderRadius: match[1] } : {};
}

export default function Features() {
    return (
        <section className="py-10 bg-white dark:bg-slate-800">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="flex flex-col items-center mb-16 space-y-6">
                    <span className="inline-flex items-center font-semibold text-blue-600 gap-2">
                        <Zap className="w-4 h-4" />
                        Powerful Features
                    </span>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                        Everything you need for{" "}
                        <span className="text-blue-600">modern education</span>
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-300 text-center max-w-2xl">
                        Transform your educational institute with our comprehensive suite of AI-powered tools and analytics
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="
                                group relative w-[220px] h-[260px]
                                flex flex-col items-center cursor-pointer
                                transform transition-all duration-500
                                opacity-90
                                group-hover:opacity-100
                                group-hover:-translate-y-4
                                group-hover:shadow-2xl
                                group-hover:scale-105
                            "
                            style={{
                                transitionProperty: "box-shadow, transform, opacity",
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                                <div
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        width: "260px",
                                        height: "220px",
                                        marginTop: "-28px",
                                        background: "#fde68a",
                                        boxShadow: "0 6px 32px 0 rgba(175, 156, 81, 0.22)",
                                        ...parseBorderRadius(blobStyles[i]),
                                    }}
                                ></div>
                            </div>
                            <div className="relative z-20 flex flex-col items-center text-center pt-10 w-full">
                                <feature.icon
                                    className={`w-12 h-12 mb-3 text-blue-600 group-hover:text-yellow-600 transition-colors duration-300`}
                                />
                                <span
                                    className={`font-extrabold text-lg mb-2 ${i === 0 ? "italic" : ""} group-hover:text-gray-900 text-gray-800 dark:text-white transition-colors`}
                                >
                                    {feature.title}
                                </span>
                                <div className="hidden group-hover:block mt-10 transition-opacity duration-300 absolute top-24 left-0 right-0 text-sm text-gray-700 px-4">
                                    <div className="mb-3">
                                        {feature.description}
                                    </div>
                                    {/* <a
                                        href="#"
                                        className="text-blue-700 underline font-semibold"
                                    >
                                        Learn More
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


