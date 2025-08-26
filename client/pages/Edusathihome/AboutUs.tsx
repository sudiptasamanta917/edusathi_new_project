import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Users,
  Brain,
  Target,
  Award,
  Sparkles,
  Heart,
  Globe,
  Zap,
  Shield,
} from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Dr. Arjun Patel",
      role: "Founder & CEO",
      avatar: "/placeholder.svg",
      description: "Former MIT professor with 15+ years in EdTech",
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      avatar: "/placeholder.svg",
      description: "AI specialist from Google, leading our tech innovation",
    },
    {
      name: "Rohit Kumar",
      role: "Head of Product",
      avatar: "/placeholder.svg",
      description: "Ex-Byju's product lead, passionate about learning",
    },
    {
      name: "Sneha Reddy",
      role: "Head of Design",
      avatar: "/placeholder.svg",
      description: "Design thinking expert from IDEO, UX advocate",
    },
  ];

  const values = [
    {
      icon: <Brain className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Innovation First",
      description:
        "We constantly push boundaries with cutting-edge AI technology",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500 dark:text-red-400" />,
      title: "Student-Centric",
      description: "Every feature is designed with student success in mind",
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500 dark:text-green-400" />,
      title: "Global Impact",
      description: "Making quality education accessible worldwide",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      title: "Trust & Security",
      description: "Your data and privacy are our top priorities",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edusathi
            </span>
          </div>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
          >
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
            About Edusathi
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Transforming Education
            <br />
            with AI Innovation
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            We provide a comprehensive white-label education platform that
            empowers institutes to launch their own branded online learning
            systems. Our AI-powered solution includes everything from custom
            domains to complete learning management systems.
          </p>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Founded in 2025, Edusathi was created to solve a critical
                problem: most institutes couldn't afford custom education
                platforms. We developed a white-label solution that gives every
                institute access to enterprise-grade learning technology with
                their own branding.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Our white-label platform provides: custom domains, branded
                interfaces, complete LMS, student management, payment gateways,
                mobile apps, AI-powered analytics, and 24/7 support. Today, over
                1,200 institutes use our platform to serve 50,000+ students
                globally.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">50,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-green-500 dark:text-green-400" />
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
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    To democratize educational technology by providing
                    affordable, white-label platforms that allow any institute
                    to launch professional online learning systems with their
                    own branding and domain.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <CardTitle className="text-xl text-slate-900 dark:text-slate-100">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 text-center">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Passionate individuals dedicated to transforming education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 text-center bg-white dark:bg-slate-800"
              >
                <CardContent className="p-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <Card className="rounded-2xl border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Impact by Numbers
              </h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">50,000+</div>
                  <p className="text-blue-100">Active Students</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">1,200+</div>
                  <p className="text-blue-100">Partner Institutes</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <p className="text-blue-100">Satisfaction Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">300%</div>
                  <p className="text-blue-100">Growth Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
