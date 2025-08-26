import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/src/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional allowed roles
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  // Also recognize the static dashboard login state set by DashboardLogin
  // This ensures admins using static .env credentials can access protected dashboard routes
  const storageLoggedIn =
    typeof window !== "undefined" &&
    ((localStorage.getItem("edusathi_logged_in") === "true") ||
      (sessionStorage.getItem("edusathi_logged_in") === "true"));

  let storageUser: any = null;
  if (typeof window !== "undefined") {
    try {
      const raw =
        localStorage.getItem("edusathi_user") ||
        sessionStorage.getItem("edusathi_user");
      storageUser = raw ? JSON.parse(raw) : null;
    } catch (_e) {
      storageUser = null;
    }
  }

  const effectiveUser: any = user || storageUser;
  const authed = isAuthenticated || !!effectiveUser || storageLoggedIn;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const targetRole = roles && roles.length > 0 ? roles[0] : undefined;
  const authPath = targetRole ? `/auth?role=${targetRole}` : "/auth";

  if (!authed) {
    return <Navigate to={authPath} replace />;
  }

  if (roles && effectiveUser && !roles.includes(effectiveUser.role)) {
    return <Navigate to={authPath} replace />;
  }

  return <>{children}</>;
}

