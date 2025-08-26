import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Building } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  const roles = [
    {
      key: "student",
      title: "Student",
      description: "Learn, track progress, and access personalized content.",
      icon: <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
      color: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
    },
    {
      key: "creator",
      title: "Creator",
      description: "Create courses, manage learners, and monetize content.",
      icon: <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />,
      color: "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
    },
    {
      key: "business",
      title: "Business",
      description: "Manage teams, analytics, and organization-wide learning.",
      icon: <Building className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />,
      color: "from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30",
    },
  ];

  const selectRole = (role: string) => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold">← Back</Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Get Started</h1>
            <p className="text-slate-600 dark:text-slate-300">Choose your role to continue</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <Card key={r.key} className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${r.color} mb-4`}>{r.icon}</div>
                <CardTitle className="text-xl text-slate-900 dark:text-slate-100">{r.title}</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">{r.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => selectRole(r.key)}>Continue as {r.title}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
