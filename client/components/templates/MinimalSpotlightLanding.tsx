import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, ArrowRight, CheckCircle2, BookOpen, MapPin, Phone, Mail } from "lucide-react";

interface MinimalSpotlightLandingProps {
  brandName?: string;
}

export default function MinimalSpotlightLanding({ brandName = "Your Institute" }: MinimalSpotlightLandingProps) {
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
            <Button size="sm" variant="outline" className="hidden sm:inline-flex">Contact</Button>
            <Button size="sm">Apply</Button>
          </div>
        </div>
      </section>

      {/* Minimal Spotlight Hero */}
      <section className="relative rounded-2xl p-10 md:p-16 bg-white border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-violet-200/60 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full bg-indigo-200/60 blur-3xl" />
        </div>
        <div className="relative">
          <Badge className="bg-indigo-600 hover:bg-indigo-700">New Batches</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4">Learn Boldly. Achieve Consistently.</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">A minimal, distraction-free learning experience designed to keep you focused on progress.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button>
            <Button size="lg" variant="outline">Explore Programs</Button>
          </div>
        </div>
      </section>

      {/* Core Value Props (Why Us) */}
      <section id="why-us" className="mt-6 grid md:grid-cols-3 gap-4">
        {["Focused curriculum", "Weekly mastery checks", "Personal mentor"]
          .map((f) => (
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

      {/* Track */}
      <section className="mt-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Choose Your Track</CardTitle>
            <CardDescription>Pick a streamlined track and stay consistent.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { t: "JEE Focus", d: "Concept + Practice" },
                { t: "NEET Focus", d: "Theory + MCQs" },
                { t: "Board Excellence", d: "NCERT + PYQs" },
              ].map((x) => (
                <Card key={x.t} className="rounded-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{x.t}</CardTitle>
                    <CardDescription>{x.d}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mt-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Student Stories</CardTitle>
            <CardDescription>Real feedback from learners who stayed consistent.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <Card key={i} className="rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${i+20}`} />
                        <AvatarFallback>S{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Student {i}</div>
                        <div className="text-xs text-muted-foreground">Batch 20{i}</div>
                      </div>
                    </div>
                    <p className="text-slate-700">“The minimal layout kept me focused and the weekly checks helped me improve steadily.”</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
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
            <p className="text-sm text-slate-600">Minimal, distraction-free learning for focused progress.</p>
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
