import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, ArrowRight, CalendarDays, Clock, CheckCircle2, BookOpen, MapPin, Phone, Mail } from "lucide-react";

interface SplitLandingProps {
  brandName?: string;
}

export default function SplitLanding({ brandName = "Your Institute" }: SplitLandingProps) {
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

      {/* Split Hero */}
      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <Badge className="mb-3">Admissions Open</Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Excel in JEE/NEET with Mentorship + Discipline</h1>
            <p className="mt-3 text-slate-600">Structured classes, adaptive tests and guided doubt-solving to help you stay consistent and improve week by week.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button size="lg">Start Application</Button>
              <Button size="lg" variant="outline" className="gap-2">Schedule Counselling <CalendarDays className="h-4 w-4" /></Button>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "Batches", v: "Morning/Evening" },
                { k: "Class Length", v: "90 mins" },
                { k: "Tests", v: "Weekly" },
              ].map((s) => (
                <Card key={s.k} className="rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{s.k}</CardTitle>
                    <CardDescription>{s.v}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl overflow-hidden">
          <div className="h-full w-full bg-gradient-to-br from-teal-100 via-sky-100 to-indigo-100" />
        </Card>
      </section>

      {/* Highlights (Why Us) */}
      <section id="why-us" className="mt-6 grid md:grid-cols-3 gap-4">
        {[
          "Concept-first teaching",
          "Dedicated mentor support",
          "AI-based analytics",
        ].map((f) => (
          <Card key={f} className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>{f}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Programs */}
      <section id="programs" className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Popular Programs</h2>
          <Button variant="ghost" className="gap-2">View all <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "JEE Main/Advanced", desc: "Concept + Practice + Tests", color: "bg-blue-50" },
            { title: "NEET UG", desc: "Theory + MCQs + Doubts", color: "bg-emerald-50" },
            { title: "Boards IX–XII", desc: "NCERT + PYQs", color: "bg-violet-50" },
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

      {/* Demo & Schedule */}
      <section className="mt-6 rounded-2xl bg-slate-50 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Book a free demo class</h3>
            <p className="text-slate-600">Experience our teaching style before you enroll.</p>
          </div>
          <div className="flex gap-3">
            <Button>Book Demo</Button>
            <Button variant="outline" className="gap-2">View Schedule <Clock className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Results & Testimonials</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i+20}`} />
                    <AvatarFallback>R{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Ranker {i}</div>
                    <div className="text-xs text-muted-foreground">Top {i}%</div>
                  </div>
                </div>
                <p className="text-slate-700">“Consistent tests and feedback made a big difference.”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      {/* Footer */}
      <footer id="contact" className="rounded-2xl border bg-white p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-md bg-slate-100">
                <GraduationCap className="h-4 w-4 text-slate-700" />
              </div>
              <div className="font-semibold text-slate-800">{brandName}</div>
            </div>
            <p className="text-sm text-slate-600">Coaching for JEE, NEET and Boards with a focus on discipline and mentorship.</p>
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
