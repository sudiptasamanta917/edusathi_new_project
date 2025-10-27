import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";
import { contentAPI } from "@/src/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  type: "pdf" | "video" | "live";
  price: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  liveLink?: string;
}

export default function CreatorContentDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/auth?role=creator', { replace: true });
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await contentAPI.getById(id);
        const c = res.data?.content ?? res.data;
        setItem(c);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const body = (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{item?.title || "Content"}</CardTitle>
        <CardDescription>Type: {item?.type}</CardDescription>
      </CardHeader>
      <CardContent>
        {item?.thumbnailUrl && (
          <img src={item.thumbnailUrl} alt="thumbnail" className="w-full max-w-md rounded-lg mb-4" />
        )}
        <div className="space-y-2">
          <p><strong>Price:</strong> ₹{item?.price ?? 0}</p>
          {item?.description && <p className="whitespace-pre-wrap">{item.description}</p>}
          {item?.type !== 'live' && item?.fileUrl && (
            <p>
              <a className="text-blue-600 underline" href={item.fileUrl} target="_blank" rel="noopener noreferrer">Open file</a>
            </p>
          )}
          {item?.type === 'live' && item?.liveLink && (
            <p>
              <a className="text-blue-600 underline" href={item.liveLink} target="_blank" rel="noopener noreferrer">Open live link</a>
            </p>
          )}
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          <Button onClick={() => navigate('/dashboard/creator/contents')}>Manage Contents</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="container max-w-3xl mx-auto px-2 md:px-4 py-4">
        {fetching ? <p>Loading...</p> : body}
      </div>
    </DashboardLayout>
  );
}
