import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";
import { salesAPI } from "@/src/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SaleSummary {
  contentId: string;
  title: string;
  totalSales: number;
  totalEarnings: number;
}

export default function CreatorSales({ embedded = false }: { embedded?: boolean }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<SaleSummary[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/auth?role=creator', { replace: true });
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    salesAPI
      .getMySales()
      .then((res: any) => {
        const rawList = res.data?.salesData || res.data?.sales || [];
        const list = Array.isArray(rawList)
          ? rawList.map((s: any) => ({
              contentId: s.contentId || s._id,
              title: s.title || s.contentTitle || s.content?.title || "",
              totalSales: Number(s.totalSales || 0),
              totalEarnings: Number(s.totalEarnings || 0),
            }))
          : [];
        setItems(list);
      })
      .catch(() => setItems([]));
  }, []);

  const totalRevenue = items.reduce((acc, i) => acc + (i.totalEarnings || 0), 0);
  const totalOrders = items.reduce((acc, i) => acc + (i.totalSales || 0), 0);

  const body = (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sales & Revenue</h1>
        <p className="text-slate-600">Track your content performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalRevenue}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>By Content</CardTitle>
          <CardDescription>Aggregate sales</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.contentId}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell>{i.totalSales}</TableCell>
                  <TableCell>₹{i.totalEarnings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
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
