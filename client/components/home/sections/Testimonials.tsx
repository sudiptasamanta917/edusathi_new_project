import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Institute Director",
      avatar: "/placeholder.svg",
      rating: 5,
      quote: "Edusathi transformed our institute completely. Student engagement increased by 300% in just 6 months.",
    },
    {
      name: "Rajesh Kumar",
      role: "Online Educator",
      avatar: "/placeholder.svg",
      rating: 5,
      quote: "The AI-powered grading system saves me 15 hours per week. I can focus on what matters - teaching.",
    },
    {
      name: "Sarah Johnson",
      role: "Institute Owner",
      avatar: "/placeholder.svg",
      rating: 5,
      quote: "Best investment we made. Our enrollment doubled and administrative work reduced by 80%.",
    },
  ];

  return (
    <section className="container max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
          Trusted by educators worldwide
        </h2>
        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
          See what our users have to say about Edusathi
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="animate-in fade-in slide-in-from-bottom-8 duration-700"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <Card className="rounded-2xl border-0 shadow-sm hover:shadow-lg dark:shadow-slate-900/20 dark:hover:shadow-slate-900/40 transition-shadow duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
