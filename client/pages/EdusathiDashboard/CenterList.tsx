import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building, ExternalLink, Plus, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CentersAPI } from "@/Api/api";

// Local types (replacing missing @shared/api)
type Center = {
  id: string;
  name: string;
  domain: string;
  website: string;
  createdAt: string;
  expireDate: string;
  status: string;
  superAdminPath: string;
};

type CentersResponse = {
  centers: Center[];
};

export default function CenterList() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchCenters = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = (await CentersAPI.list()) as CentersResponse;
      setCenters(data.centers);
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast({
        title: "Error",
        description: "Failed to load centers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleGoToCenter = (center: Center) => {
    const url = `${center.website}${center.superAdminPath}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Center List
            </h2>
            <p className="text-muted-foreground">
              Manage and access your educational centers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCenters(true)}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button asChild>
              <Link to="#">
                <Plus className="mr-2 h-4 w-4" />
                Add Center
              </Link>
            </Button>
          </div>
        </div>

        {/* Centers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Educational Centers
            </CardTitle>
            <CardDescription>
              {centers.length > 0
                ? `Showing ${centers.length} center${centers.length !== 1 ? "s" : ""}`
                : "No centers created yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
            ) : centers.length === 0 ? (
              <div className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No centers found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get started by creating your first educational center.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/dashboard/centers/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Center
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Center Name</TableHead>
                      <TableHead>Domain Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Expire Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centers.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <Building className="h-4 w-4 text-primary" />
                            </div>
                            {center.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {center.domain}
                        </TableCell>
                        <TableCell>
                          <a
                            href={center.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            {center.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(center.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatDate(center.expireDate)}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {new Date(center.expireDate) > new Date()
                                ? `${Math.ceil((new Date(center.expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                                : "Expired"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              center.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              center.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : ""
                            }
                          >
                            {center.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleGoToCenter(center)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Go
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
