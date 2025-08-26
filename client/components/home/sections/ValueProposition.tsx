import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, MessageCircle, BarChart3 } from "lucide-react";

export default function ValueProposition() {
  const features = [
    {
      icon: <Globe className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Ready-to-use digital platform",
      description: "Launch your institute online in minutes, not months",
    },
    {
      icon: <Users className="w-8 h-8 text-green-500 dark:text-green-400" />,
      title: "Smart student management",
      description: "AI-powered insights for better student outcomes",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      title: "In-built marketing tools",
      description: "Email/SMS/WhatsApp integration for growth",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500 dark:text-orange-400" />,
      title: "All-in-one dashboard",
      description: "Everything you need in one powerful interface",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 py-16 sm:py-20 md:py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 leading-tight">
            Everything you need to run your institute
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Powerful tools designed for modern education
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-slate-800 group">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 p-3 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-colors w-fit mx-auto">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
