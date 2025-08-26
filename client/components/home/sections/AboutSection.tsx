import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Building, Globe, Sparkles } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="container max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          About Edusathi
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Transforming education through AI innovation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Our Mission
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Our mission is to empower education with technology and make learning interactive, engaging, and effective. Whether you are a school, institute, or individual learner, we have the right solution for you.

            Together, let's build the future of education
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">50,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">1,200+ Institutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Global Reach</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-0 shadow-xl dark:shadow-slate-900/50">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Our Vision
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Welcome to Edusathi, the one-stop platform for modern educational apps.
                We believe that learning should be simple, smart, and accessible for everyone. That's why we created a system where schools, teachers, and students can explore different educational apps and choose the best plan according to their needs.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <Link to="/about">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
            Learn More About Us
          </Button>
        </Link>
      </div>
    </section>
  );
}
