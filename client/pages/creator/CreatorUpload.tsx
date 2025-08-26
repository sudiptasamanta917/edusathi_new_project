import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";
import { businessAPI, contentAPI } from "@/src/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/DashboardLayout";

interface Business {
  _id: string;
  name: string;
}

export default function CreatorUpload({ embedded = false, onNavigateSection }: { embedded?: boolean; onNavigateSection?: (section: "profile" | "upload" | "contents" | "sales") => void }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"pdf" | "video" | "live">("pdf");
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [liveLink, setLiveLink] = useState("");
  const [businessId, setBusinessId] = useState<string>("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const res = await businessAPI.getAll();
        const list = (res as any)?.data?.businesses ?? (res as any)?.data ?? [];
        setBusinesses(Array.isArray(list) ? (list as Business[]) : []);
      } catch (e) {
        // ignore silently for now
      }
    };
    loadBusinesses();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth?role=creator", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("price", String(price));
      if (businessId) formData.append("businessId", businessId);

      if (type === "live") {
        formData.append("liveLink", liveLink);
      } else if (file) {
        formData.append("file", file);
      } else {
        alert("Please select a file for PDF/Video content");
        setSubmitting(false);
        return;
      }

      // Optional thumbnail for pdf/video only
      if (thumbnail && type !== "live") {
        formData.append("thumbnail", thumbnail);
      }

      const res = await contentAPI.create(formData);
      const created = (res as any)?.data?.content ?? (res as any)?.data;
      const id = created?._id;
      if (embedded && onNavigateSection) {
        onNavigateSection("contents");
      } else if (id) {
        navigate(`/dashboard/creator/content/${id}`);
      } else {
        navigate("/dashboard/creator/contents");
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to upload content");
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>Create a new course item</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v: "pdf" | "video" | "live") => setType(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            {/* <div>
              <Label>Assign to Business (optional)</Label>
              <Select value={businessId} onValueChange={setBusinessId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select business" /></SelectTrigger>
                <SelectContent>
                  {businesses.map((b) => (
                    <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {type !== "live" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" accept={type === "pdf" ? ".pdf" : "video/*"} onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail (optional)</Label>
                <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="liveLink">Live Link</Label>
              <Input id="liveLink" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://..." />
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  if (embedded) return content;

  return (
    <DashboardLayout>
      <div className="container max-w-3xl mx-auto px-2 md:px-4 py-4">
        {content}
      </div>
    </DashboardLayout>
  );
}
