import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/Api/api";

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

export default function MyCourses() {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ items: CourseItem[] }>("/api/student/my-courses")
      .then((data) => setItems(data.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading your courses...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      {items.length === 0 && <div className="text-slate-600">No enrolled courses yet.</div>}
      <div className="space-y-4">
        {items.map((en) => (
          <Card key={en.enrollmentId} className="shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{en.content.title}</span>
                <span className="text-blue-600 font-semibold">{en.content.type.toUpperCase()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">{en.content.description}</p>
              {en.content.type === "pdf" && en.content.resourceUrl && (
                <a href={en.content.resourceUrl} target="_blank" rel="noreferrer">
                  <Button>Download</Button>
                </a>
              )}
              {en.content.type === "video" && en.content.resourceUrl && (
                <video src={en.content.resourceUrl} controls className="w-full max-w-3xl rounded" />
              )}
              {en.content.type === "live" && en.content.liveLink && (
                <a href={en.content.liveLink} target="_blank" rel="noreferrer">
                  <Button>Join Live Class</Button>
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
