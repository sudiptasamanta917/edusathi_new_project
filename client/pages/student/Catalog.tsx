import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/Api/api";

type ContentItem = {
  _id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "live";
  price: number;
  businessName: string;
  resourceUrl?: string;
  liveLink?: string;
};

export default function Catalog() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const liveRef = useRef<HTMLDivElement | null>(null);
  const coursesRef = useRef<HTMLDivElement | null>(null);
  const materialsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    apiGet<{ items: ContentItem[] }>("/api/contents")
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  const liveItems = useMemo(() => items.filter((i) => i.type === "live"), [items]);
  const courseItems = useMemo(() => items.filter((i) => i.type === "video"), [items]);
  const materialItems = useMemo(() => items.filter((i) => i.type === "pdf"), [items]);

  // Smooth scroll to anchors
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const map: Record<string, HTMLDivElement | null> = {
      live: liveRef.current,
      courses: coursesRef.current,
      materials: materialsRef.current,
    };
    if (hash && map[hash]) {
      map[hash]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Course Categories</h1>
          <div className="flex gap-2">
            <Link to="#live" className="text-sm text-blue-600">Live</Link>
            <Link to="#courses" className="text-sm text-blue-600">Courses</Link>
            <Link to="#materials" className="text-sm text-blue-600">Materials</Link>
          </div>
        </div>

        <div className="mb-6">
          <Button variant="secondary" onClick={() => navigate("/student")}>Back to Dashboard</Button>
        </div>

        {/* Live Section */}
        <div ref={liveRef} id="live" className="scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Live Classes</h2>
          {loading ? (
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
                    {c.liveLink ? (
                      <a href={c.liveLink} target="_blank" rel="noreferrer">
                        <Button size="sm">Join Now</Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        Link not set
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-200 my-8" />

        {/* Courses Section */}
        <div ref={coursesRef} id="courses" className="scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Courses</h2>
          {loading ? (
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
                    <Link to="/student/my-courses">
                      <Button size="sm" variant="secondary">View</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-200 my-8" />

        {/* Materials Section */}
        <div ref={materialsRef} id="materials" className="scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Materials</h2>
          {loading ? (
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
                      <Button size="sm" variant="secondary" disabled>
                        Not available
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
