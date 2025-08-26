import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import RoleDashboardLayout from "../../components/RoleDashboardLayout";
import { LayoutDashboard, UploadCloud, List, BarChart3, User } from "lucide-react";
import { useAuth } from "../../src/contexts/AuthContext";
import CreatorUpload from "./CreatorUpload";
import CreatorContents from "./CreatorContents";
import CreatorSales from "./CreatorSales";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreatorDashboard() {
  const { user, updateAvatar } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const navigateSection = (s: "profile" | "upload" | "contents" | "sales" | "account") => {
    const map: Record<string, string> = {
      profile: "/creator",
      upload: "/creator/upload",
      contents: "/creator/contents",
      sales: "/creator/sales",
      account: "/creator/account",
    };
    navigate(map[s] || "/creator");
  };

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
    navigate("/auth?role=creator", { replace: true });
  }

  const onUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      setUploading(true);
      await updateAvatar(avatarFile);
      setAvatarFile(null);
    } catch (e) {
      // noop
    } finally {
      setUploading(false);
    }
  };

  // Build navigation for RoleDashboardLayout
  const navigationItems = [
    { title: "Dashboard", href: "/creator", icon: LayoutDashboard, isActive: currentPath === "/creator", isExpandable: false as const },
    { title: "Upload", href: "/creator/upload", icon: UploadCloud, isActive: currentPath.startsWith("/creator/upload"), isExpandable: false as const },
    { title: "Contents", href: "/creator/contents", icon: List, isActive: currentPath.startsWith("/creator/contents"), isExpandable: false as const },
    { title: "Sales", href: "/creator/sales", icon: BarChart3, isActive: currentPath.startsWith("/creator/sales"), isExpandable: false as const },
    { title: "Account", href: "/creator/account", icon: User, isActive: currentPath.startsWith("/creator/account"), isExpandable: false as const },
  ];

  const initials = (user?.name || user?.email || "C").slice(0, 1).toUpperCase();
  const avatarSrc = user?.avatarUrl || undefined;

  return (
    <RoleDashboardLayout
      title="Creator Dashboard"
      navigationItems={navigationItems}
      sidebarProfile={
        <div className="flex items-center gap-3">
          <button className="rounded-full" onClick={() => navigate("/creator/account")} title="Profile">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarSrc} alt={user?.name || "C"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-1">{user?.name || "Creator"}</span>
            <span className="text-xs text-muted-foreground">View profile</span>
          </div>
        </div>
      }
      sidebarFooter={<Button className="w-full" size="sm" variant="destructive" onClick={logout}>Logout</Button>}
    >
      {/* Main content */}
      <div className="space-y-6">
        {currentPath.startsWith("/creator/upload") ? (
          <CreatorUpload embedded onNavigateSection={navigateSection} />
        ) : currentPath.startsWith("/creator/contents") ? (
          <CreatorContents embedded onNavigateSection={navigateSection} />
        ) : currentPath.startsWith("/creator/sales") ? (
          <CreatorSales embedded />
        ) : currentPath.startsWith("/creator/account") ? (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarSrc} alt={user?.name || "C"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <div>
                    <Label htmlFor="creator-avatar">Profile picture</Label>
                    <Input id="creator-avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <Button size="sm" disabled={!avatarFile || uploading} onClick={onUploadAvatar}>
                      {uploading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p><strong>Name:</strong> {user?.name || "-"}</p>
                <p><strong>Email:</strong> {user?.email || "-"}</p>
                <p><strong>Role:</strong> {user?.role || "creator"}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your creator info</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || "U"} />
                  <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <div>
                    <Label htmlFor="avatar">Profile picture</Label>
                    <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <Button size="sm" disabled={!avatarFile || uploading} onClick={onUploadAvatar}>
                      {uploading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p><strong>Name:</strong> {user?.name || "-"}</p>
                <p><strong>Email:</strong> {user?.email || "-"}</p>
                <p><strong>Role:</strong> {user?.role || "creator"}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleDashboardLayout>
  );
}
