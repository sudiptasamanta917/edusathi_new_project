import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Trophy, BookOpen, Users, CheckCircle2, ArrowRight, MapPin, Phone, Mail } from "lucide-react";

interface FeatureFirstLandingProps {
  brandName?: string;
}

export default function FeatureFirstLanding({ brandName = "Your Institute" }: FeatureFirstLandingProps) {
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
            <Button size="sm" variant="outline" className="hidden sm:inline-flex">Brochure</Button>
            <Button size="sm">Join Now</Button>
          </div>
        </div>
      </section>

      {/* Feature-first Hero (Why Us) */}
      <section id="why-us" className="rounded-2xl p-8 md:p-12 bg-gradient-to-br from-amber-50 to-orange-50 border">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="bg-amber-500 hover:bg-amber-600">Rank-Oriented Prep</Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">Get Results with Structured Features</h1>
            <p className="mt-3 text-slate-700">We prioritize what moves the needle: teaching quality, practice design, analytics, and discipline.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2">Start Free Trial <ArrowRight className="h-4 w-4" /></Button>
              <Button size="lg" variant="outline">Talk to Mentor</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: BookOpen, t: "Concept Modules", d: "Lecture + Worksheets" },
              { icon: Users, t: "Mentor Support", d: "Dedicated guidance" },
              { icon: Trophy, t: "Test Series", d: "Weekly analytics" },
              { icon: CheckCircle2, t: "Doubt Solving", d: "Daily sessions" },
            ].map((f) => (
              <Card key={f.t} className="rounded-xl">
                <CardContent className="p-4">
                  <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center mb-3">
                    <f.icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="font-medium">{f.t}</div>
                  <div className="text-sm text-slate-600">{f.d}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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

      {/* Outcomes */}
      <section className="mt-6 grid md:grid-cols-3 gap-4">
        {[
          { k: "AIR Top 500", v: "120+" },
          { k: "Selections", v: "1,000+" },
          { k: "Avg. Improvement", v: "+28%" },
        ].map((s) => (
          <Card key={s.k} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{s.v}</CardTitle>
              <CardDescription>{s.k}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="mt-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Student Experiences</CardTitle>
            <CardDescription>What our toppers say about us.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <Card key={i} className="rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${i+30}`} />
                        <AvatarFallback>T{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Topper {i}</div>
                        <div className="text-xs text-muted-foreground">Rank {i * 100}</div>
                      </div>
                    </div>
                    <p className="text-slate-700">“The structure and weekly analysis helped me stay on track.”</p>
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
            <p className="text-sm text-slate-600">Feature-first learning designed to maximize outcomes.</p>
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
