import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, Star, TrendingUp } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      number: "50,000+",
      label: "Students Enrolled ",
      description: "Active learners on our platform",
      icon: <Users className="w-8 h-8 text-white-500" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "1,200+",
      label: "Institutes",
      description: "Trust Edusathi worldwide",
      icon: <Building className="w-8 h-8 text-white-500" />,
      color: "from-green-500 to-green-600",
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      description: "Customer satisfaction score",
      icon: <Star className="w-8 h-8 text-white-500" />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      number: "300%",
      label: "Growth Average",
      description: "Increase in enrollments",
      icon: <TrendingUp className="w-8 h-8 text-white-500" />,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 py-16 sm:py-20 md:py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
            Success Stories by Numbers
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Join thousands of institutes already transforming education
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 bg-white dark:bg-slate-800 hover:-translate-y-3 group">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`p-4 rounded-full bg-gradient-to-r ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                  >
                    {stat.number}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
