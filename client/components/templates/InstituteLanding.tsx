import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, BookOpen, Users, Star, ArrowRight, CheckCircle2, MapPin, Phone, Mail } from "lucide-react";

interface InstituteLandingProps {
  brandName?: string;
}

export default function InstituteLanding({ brandName = "Your Institute" }: InstituteLandingProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] -mx-2 md:-mx-4">
      {/* Header */}
      <section className="rounded-2xl border bg-white p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100">
              <GraduationCap className="h-5 w-5 text-slate-700" />
            </div>
            <div className="font-semibold text-slate-800">{brandName}</div>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-600">
            <a href="#programs" className="hover:text-slate-900">Programs</a>
            <a href="#why-us" className="hover:text-slate-900">Why Us</a>
            <a href="#testimonials" className="hover:text-slate-900">Results</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="hidden sm:inline-flex">Enquire</Button>
            <Button size="sm">Apply Now</Button>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white p-8 md:p-12">
        <div className="max-w-5xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/15">
              <GraduationCap className="h-5 w-5" />
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 text-white">NAAC Inspired Excellence</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            {brandName} – Empowering Students for the Future
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 text-base md:text-lg max-w-2xl">
            Premier institute for competitive exams and skill development. Learn from top mentors with a modern curriculum and real outcomes.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100">
              Apply Now
            </Button>
            <Button size="lg" variant="secondary" className="bg-white/15 text-white hover:bg-white/20">
              Download Brochure
            </Button>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Highlights */}
      <section className="grid md:grid-cols-3 gap-4 mt-6">
        {[{ label: "Students Trained", value: "10,000+" }, { label: "Success Rate", value: "94%" }, { label: "Expert Mentors", value: "50+" }].map((s) => (
          <Card key={s.label} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{s.value}</CardTitle>
              <CardDescription>{s.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Programs */}
      <section id="programs" className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Popular Programs</h2>
          <Button variant="ghost" className="gap-2">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "JEE Main/Advanced", desc: "2-year integrated program with advanced problem solving.", color: "bg-blue-50" },
            { title: "NEET UG", desc: "1–2 year program with rigorous practice and mentorship.", color: "bg-emerald-50" },
            { title: "Foundation IX–XII", desc: "Strong fundamentals for Olympiads and Boards.", color: "bg-violet-50" },
          ].map((p) => (
            <Card key={p.title} className="rounded-2xl">
              <CardHeader>
                <div className={`h-28 w-full rounded-xl ${p.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-slate-600" />
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </div>
                <CardDescription>{p.desc}</CardDescription>
                <div className="mt-3">
                  <Button size="sm" variant="outline">Explore</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="mt-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Why Choose {brandName}?</CardTitle>
            <CardDescription>Outcome-focused learning backed by mentors and discipline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {["Personal mentorship", "Adaptive test series", "Doubt clearing sessions", "Parent progress reports"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Student Stories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i+10}`} />
                    <AvatarFallback>S{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Student {i}</div>
                    <div className="text-xs text-muted-foreground">AIR {150 + i}</div>
                  </div>
                </div>
                <p className="text-slate-700">
                  “The mentors and test series helped me stay consistent and improve every week.”
                </p>
                <div className="mt-3 flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      {/* CTA */}
      <section className="rounded-2xl bg-slate-50 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Start your journey with {brandName}</h3>
            <p className="text-slate-600">Admissions are open. Limited seats available.</p>
          </div>
          <div className="flex gap-3">
            <Button className="">Apply Now</Button>
            <Button variant="outline">Talk to Counsellor</Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contact" className="rounded-2xl border bg-white p-6 mt-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-md bg-slate-100">
                <GraduationCap className="h-4 w-4 text-slate-700" />
              </div>
              <div className="font-semibold text-slate-800">{brandName}</div>
            </div>
            <p className="text-sm text-slate-600">Premier coaching for JEE, NEET and Foundation. Learn with discipline and mentorship.</p>
          </div>
          <div>
            <div className="font-medium mb-2">Contact</div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123, Main Campus Road, Kolkata</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 90000 00000</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@{brandName.toLowerCase().replace(/\s+/g, '')}.com</li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Quick Links</div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><a href="#programs" className="hover:underline">Programs</a></li>
              <li><a href="#testimonials" className="hover:underline">Results</a></li>
              <li><a href="#why-us" className="hover:underline">Why Us</a></li>
            </ul>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-xs text-slate-500">© {new Date().getFullYear()} {brandName}. All rights reserved.</div>
      </footer>
    </div>
  );
}
