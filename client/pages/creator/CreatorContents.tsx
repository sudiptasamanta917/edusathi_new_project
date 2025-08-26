import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";
import { businessAPI, contentAPI } from "@/src/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContentItem {
  _id: string;
  title: string;
  type: 'pdf' | 'video' | 'live';
  price: number;
  isActive: boolean;
  businessId?: string;
}

interface Business { _id: string; name: string; }

export default function CreatorContents({ embedded = false, onNavigateSection }: { embedded?: boolean; onNavigateSection?: (section: "profile" | "upload" | "contents" | "sales") => void }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [eTitle, setETitle] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [ePrice, setEPrice] = useState<number>(0);
  const [eLiveLink, setELiveLink] = useState("");
  const [editType, setEditType] = useState<'pdf'|'video'|'live'>('pdf');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/auth?role=creator', { replace: true });
  }, [loading, isAuthenticated, navigate]);

  const load = async () => {
    const res = await contentAPI.getMyContents();
    const list = res.data?.contents || res.data || [];
    setContents(list);
  };

  useEffect(() => {
    load();
    businessAPI.getAll().then((res: any) => {
      const list = res?.data?.businesses ?? res?.data ?? [];
      setBusinesses(Array.isArray(list) ? list : []);
    });
  }, []);

  const onAssign = async (id: string, businessId: string) => {
    try {
      setAssigning(id);
      await contentAPI.assignToBusiness(id, businessId);
      await load();
    } finally {
      setAssigning(null);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this content?')) return;
    try {
      setDeleting(id);
      await contentAPI.delete(id);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = async (id: string) => {
    setEditId(id);
    setEditOpen(true);
    try {
      const res = await contentAPI.getById(id);
      const c = res.data?.content ?? res.data;
      setETitle(c?.title || "");
      setEDescription(c?.description || "");
      setEPrice(c?.price || 0);
      setELiveLink(c?.liveLink || "");
      setEditType(c?.type || 'pdf');
    } catch (_e) {
      // ignore
    }
  };

  const onSaveEdit = async () => {
    if (!editId) return;
    try {
      setSaving(true);
      const payload: any = {
        title: eTitle,
        description: eDescription,
        price: Number(ePrice),
      };
      if (editType === 'live') payload.liveLink = eLiveLink;
      await contentAPI.update(editId, payload);
      setEditOpen(false);
      setEditId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const body = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Contents</h1>
        <Button onClick={() => (embedded && onNavigateSection ? onNavigateSection("upload") : navigate('/dashboard/creator/upload'))}>New Content</Button>
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Contents</CardTitle>
          <CardDescription>Manage your uploaded items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="capitalize">{c.type}</TableCell>
                  <TableCell>₹{c.price || 0}</TableCell>
                  <TableCell>
                    <Select defaultValue={c.businessId || ''} onValueChange={(v: string) => onAssign(c._id, v)}>
                      <SelectTrigger className="w-48"><SelectValue placeholder="Assign business" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {businesses.map((b) => (
                          <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{c.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/creator/content/${c._id}`)}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(c._id)}>Edit</Button>
                    <Button variant="destructive" size="sm" disabled={deleting === c._id} onClick={() => onDelete(c._id)}>
                      {deleting === c._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="etitle">Title</Label>
              <Input id="etitle" value={eTitle} onChange={(e) => setETitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edesc">Description</Label>
              <Textarea id="edesc" value={eDescription} onChange={(e) => setEDescription(e.target.value)} rows={3} />
            </div>
            <div>
              <Label htmlFor="eprice">Price (₹)</Label>
              <Input id="eprice" type="number" min={0} value={ePrice} onChange={(e) => setEPrice(Number(e.target.value))} />
            </div>
            {editType === 'live' && (
              <div>
                <Label htmlFor="elive">Live Link</Label>
                <Input id="elive" value={eLiveLink} onChange={(e) => setELiveLink(e.target.value)} placeholder="https://..." />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={onSaveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  if (embedded) return body;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {body}
      </div>
    </div>
  );
}
