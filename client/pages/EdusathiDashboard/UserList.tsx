import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AdminAPI } from "@/Api/api";

interface UserItem {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
}

export default function UserList() {
  const { role: roleParam } = useParams<{ role: string }>();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const normRole = useMemo(() => {
    const r = (roleParam || "").toLowerCase();
    if (r === "business" || r === "businesses") return "business";
    if (r === "creator" || r === "creators") return "creator";
    if (r === "student" || r === "students") return "student";
    return "business"; // default
  }, [roleParam]);

  const title = useMemo(() => {
    if (normRole === "creator") return "Creators";
    if (normRole === "student") return "Students";
    return "Businesses";
  }, [normRole]);

  const fetchUsers = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data: any = await AdminAPI.listUsers(normRole);
      const list: UserItem[] = Array.isArray(data)
        ? data
        : (data?.users || data?.items || []);
      setUsers(list);
    } catch (e: any) {
      toast({ title: "Failed to load users", description: e?.message || "", variant: "destructive" });
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normRole]);

  const formatDate = (s?: string) => {
    if (!s) return "—";
    const d = new Date(s);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title} List</h2>
            <p className="text-muted-foreground">All registered {title.toLowerCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchUsers(true)} disabled={refreshing}>
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {users.length > 0 ? `Showing ${users.length} ${title.toLowerCase()}` : `No ${title.toLowerCase()} found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-2 text-lg font-semibold">No {title.toLowerCase()} found</h3>
                <p className="mt-1 text-sm text-muted-foreground">No records available.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id || u.id || `${u.email}`}> 
                        <TableCell className="font-medium">{u.name || "—"}</TableCell>
                        <TableCell>{u.email || "—"}</TableCell>
                        <TableCell className="capitalize">{u.role || normRole}</TableCell>
                        <TableCell>{(u.status || "active").toString()}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground">
          Quick links: {" "}
          <Link to="/dashboard/users/businesses" className="text-blue-600 hover:underline">Businesses</Link>{" • "}
          <Link to="/dashboard/users/creators" className="text-blue-600 hover:underline">Creators</Link>{" • "}
          <Link to="/dashboard/users/students" className="text-blue-600 hover:underline">Students</Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
