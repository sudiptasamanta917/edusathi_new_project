import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/Api/api";
import { ChevronDown, LayoutDashboard, List, Video, FileText, GraduationCap, ClipboardList, User, Sparkles } from "lucide-react";
import MyCourses from "./MyCourses";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseItem {
  enrollmentId: string;
  content: {
    id: string;
    title: string;
    description: string;
    type: "pdf" | "video" | "live";
    price: number;
    businessName: string;
    resourceUrl?: string;
    liveLink?: string;
  };
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [allContents, setAllContents] = useState<
    { _id: string; title: string; description: string; type: "pdf" | "video" | "live"; price: number; businessName: string; resourceUrl?: string; liveLink?: string }[]
  >([]);
  const [loadingContents, setLoadingContents] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [openClassRoom, setOpenClassRoom] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const p =
      sessionStorage.getItem("userProfile") ||
      localStorage.getItem("userProfile") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("studentAvatarUrl") || undefined;
    setAvatarUrl(u);
  }, []);

  const onUploadAvatar = () => {
    if (!avatarFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem("studentAvatarUrl", dataUrl);
      setAvatarUrl(dataUrl);
      setAvatarFile(null);
    };
    reader.readAsDataURL(avatarFile);
  };

  useEffect(() => {
    apiGet<{ items: CourseItem[] }>("/api/student/my-courses")
      .then((d) => setCourses(d.items))
      .finally(() => setLoadingCourses(false));
  }, []);

  // fetch catalog contents for sidebar views
  useEffect(() => {
    apiGet<{ items: any[] }>("/api/contents")
      .then((d) => setAllContents(d.items || []))
      .finally(() => setLoadingContents(false));
  }, []);

  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");
  const role = profile?.role || "student";
  if (!token) return <Navigate to="/auth?role=student" replace />;
  if (role !== "student") return <Navigate to={`/auth?role=${role || "student"}`} replace />;

  const initials = (profile?.name || profile?.email || "S").slice(0, 1).toUpperCase();
  const total = courses.length;
  const liveCount = courses.filter((c) => c.content.type === "live").length;
  const videoCount = courses.filter((c) => c.content.type === "video").length;
  const pdfCount = courses.filter((c) => c.content.type === "pdf").length;

  // derive section from route
  const section = useMemo(() => {
    if (location.pathname.startsWith("/student/live")) return "live";
    if (location.pathname.startsWith("/student/courses")) return "courses";
    if (location.pathname.startsWith("/student/materials")) return "materials";
    if (location.pathname.startsWith("/student/mock-tests")) return "mock";
    if (location.pathname.startsWith("/student/my-courses")) return "my-courses";
    if (location.pathname.startsWith("/student/account")) return "account";
    return "home";
  }, [location.pathname]);

  const liveItems = useMemo(() => allContents.filter((i) => i.type === "live"), [allContents]);
  const courseItems = useMemo(() => allContents.filter((i) => i.type === "video"), [allContents]);
  const materialItems = useMemo(() => allContents.filter((i) => i.type === "pdf"), [allContents]);

  function go(path: string) {
    navigate(path);
  }

  function logout() {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");
      storage.removeItem("accessToken");
      storage.removeItem("refreshToken");
      storage.removeItem("user");
      storage.removeItem("userProfile");
      storage.removeItem("isLoggedIn");
      storage.removeItem("userRole");
    }
    navigate("/auth?role=student", { replace: true });
  }

  // pick a quick-continue item
  const continueItem = courses.find((c) => c.content.type !== "live" && c.content.resourceUrl) || courses[0];

  // Build navigation for RoleDashboardLayout
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      isActive: location.pathname === "/student",
      isExpandable: false as const,
    },
    {
      title: "Class Room",
      icon: List,
      isExpandable: true as const,
      isOpen: openClassRoom,
      onToggle: () => setOpenClassRoom((v) => !v),
      subItems: [
        { title: "Live Classes", href: "/student/live", icon: Video, isActive: location.pathname.startsWith("/student/live") },
        { title: "Course List", href: "/student/courses", icon: List, isActive: location.pathname.startsWith("/student/courses") },
        { title: "Study Materials", href: "/student/materials", icon: FileText, isActive: location.pathname.startsWith("/student/materials") },
      ],
    },
    { title: "My Courses", href: "/student/my-courses", icon: GraduationCap, isActive: location.pathname.startsWith("/student/my-courses"), isExpandable: false as const },
    { title: "Mock Tests", href: "/student/mock-tests", icon: ClipboardList, isActive: location.pathname.startsWith("/student/mock-tests"), isExpandable: false as const },
    { title: "Account", href: "/student/account", icon: User, isActive: location.pathname.startsWith("/student/account"), isExpandable: false as const },
  ];

  return (
    <RoleDashboardLayout
      title="Student Dashboard"
      navigationItems={navigationItems}
      sidebarProfile={
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300">
          <button className="rounded-full ring-2 ring-blue-200 ring-offset-2 hover:ring-blue-300 transition-all duration-300" onClick={() => navigate("/student/account")} title="Profile">
            <Avatar className="h-11 w-11">
              <AvatarImage src={avatarUrl} alt={profile?.name || "S"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800 line-clamp-1">{profile?.name || "Student"}</span>
            <span className="text-xs text-blue-600 font-medium">View profile</span>
          </div>
        </div>
      }
      sidebarFooter={
        <Button 
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
          size="sm" 
          onClick={logout}
        >
          Logout
        </Button>
      }
    >
      {/* Main content (section router) */}
      {section === "home" && (
        <div className="space-y-8">
          {/* Enhanced Welcome Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 font-display">
                Welcome back{profile?.name ? `, ${profile.name}` : ""}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to continue your learning journey today?
              </p>
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Total Courses", value: total, icon: "📚", color: "from-blue-500 to-blue-600" },
              { label: "Live Classes", value: liveCount, icon: "🎥", color: "from-red-500 to-red-600" },
              { label: "Video Courses", value: videoCount, icon: "📹", color: "from-green-500 to-green-600" },
              { label: "Study Materials", value: pdfCount, icon: "📄", color: "from-purple-500 to-purple-600" },
            ].map((stat, index) => (
              <Card key={index} className="relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 interactive">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Quick Actions</CardTitle>
                </div>
                <CardDescription className="text-slate-600">Jump right into learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate("/my-courses")} 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Continue Learning
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/student/courses")}
                  className="w-full border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300"
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Account</CardTitle>
                </div>
                <CardDescription className="text-slate-600">Profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500 font-medium">Name:</span> 
                    <span className="font-semibold text-slate-800">{profile?.name || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500 font-medium">Email:</span> 
                    <span className="font-semibold text-slate-800">{profile?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                    <span className="text-slate-500 font-medium">Role:</span> 
                    <span className="font-semibold text-slate-800 capitalize">{profile?.role || "student"}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate("/profile")}
                    className="w-full border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-semibold rounded-xl transition-all duration-300"
                  >
                    Manage Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Enrollments */}
          <Card className="rounded-3xl border-0 shadow-lg card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">Recent Enrollments</CardTitle>
                    <CardDescription className="text-slate-600">Your latest courses</CardDescription>
                  </div>
                </div>
                <Link to="/my-courses" className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-slate-600">Loading courses...</span>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <div className="text-slate-600 mb-4">No courses yet. Enroll from the catalog.</div>
                  <Button onClick={() => navigate("/catalog")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl">
                    Browse Catalog
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.slice(0, 4).map((en) => (
                    <div key={en.enrollmentId} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 interactive">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                          {en.content.type === "live" ? "🎥" : en.content.type === "video" ? "📹" : "📄"}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 leading-5 line-clamp-1">{en.content.title}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium uppercase">
                              {en.content.type}
                            </span>
                            <span className="mx-2">•</span>
                            <span>{en.content.businessName}</span>
                          </div>
                        </div>
                      </div>
                      {en.content.type === "live" && en.content.liveLink ? (
                        <a href={en.content.liveLink} target="_blank" rel="noreferrer">
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl">
                            Join Live
                          </Button>
                        </a>
                      ) : en.content.resourceUrl ? (
                        en.content.type === "pdf" ? (
                          <a href={en.content.resourceUrl} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline" className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold rounded-xl">
                              Open PDF
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => navigate("/my-courses")} className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold rounded-xl">
                            Continue
                          </Button>
                        )
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => navigate("/my-courses")} className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold rounded-xl">
                          Open
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {section !== "home" && (
        <div>
          {section === "live" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Live Classes</h2>
              {loadingContents ? (
                <div className="text-slate-600">Loading...</div>
              ) : liveItems.length === 0 ? (
                <div className="text-slate-600">No live classes available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveItems.map((c) => (
                    <Card key={c._id} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="line-clamp-1">{c.title}</span>
                          <span className="text-blue-600 font-semibold whitespace-nowrap">₹{c.price}</span>
                        </CardTitle>
                        <CardDescription>by {c.businessName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {c.liveLink ? (
                            <a href={c.liveLink} target="_blank" rel="noreferrer">
                              <Button size="sm">Join Now</Button>
                            </a>
                          ) : (
                            <Button size="sm" variant="secondary" disabled>Link not set</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "courses" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Courses List</h2>
              {loadingContents ? (
                <div className="text-slate-600">Loading...</div>
              ) : courseItems.length === 0 ? (
                <div className="text-slate-600">No courses available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseItems.map((c) => (
                    <Card key={c._id} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="line-clamp-1">{c.title}</span>
                          <span className="text-blue-600 font-semibold whitespace-nowrap">₹{c.price}</span>
                        </CardTitle>
                        <CardDescription>by {c.businessName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button size="sm" variant="secondary" onClick={() => navigate("/catalog#courses")}>View Details</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "materials" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Study Materials</h2>
              {loadingContents ? (
                <div className="text-slate-600">Loading...</div>
              ) : materialItems.length === 0 ? (
                <div className="text-slate-600">No materials available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materialItems.map((c) => (
                    <Card key={c._id} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="line-clamp-1">{c.title}</span>
                          <span className="text-blue-600 font-semibold whitespace-nowrap">₹{c.price}</span>
                        </CardTitle>
                        <CardDescription>by {c.businessName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {c.resourceUrl ? (
                          <a href={c.resourceUrl} target="_blank" rel="noreferrer">
                            <Button size="sm">Get Materials</Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="secondary" onClick={() => navigate("/catalog#materials")}>View Details</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "mock" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Mock Tests</h2>
              <div className="text-slate-600 mb-3">Practice tests to evaluate your preparation. (Coming soon)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Full Length Test 1", "Subject Test - Math", "Subject Test - Physics"].map((t, i) => (
                  <Card key={i} className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{t}</CardTitle>
                      <CardDescription>Duration: 60 min • Questions: 50</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" disabled>Start Test (Soon)</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {section === "my-courses" && (
            <div>
              <MyCourses />
            </div>
          )}

          {section === "account" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Account</h2>
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl} alt={profile?.name || "S"} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                      <div>
                        <Label htmlFor="student-avatar">Profile picture</Label>
                        <Input id="student-avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                      </div>
                      <div>
                        <Button size="sm" onClick={onUploadAvatar} disabled={!avatarFile}>Upload Avatar</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-slate-500">Name:</span> <span className="font-medium">{profile?.name || "-"}</span></div>
                    <div><span className="text-slate-500">Email:</span> <span className="font-medium">{profile?.email || "-"}</span></div>
                    <div><span className="text-slate-500">Role:</span> <span className="font-medium">{profile?.role || "student"}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </RoleDashboardLayout>
  );
}
