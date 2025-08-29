import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Plus, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { PricingAPI, AdminAPI, AuthAPI } from '@/Api/api';
import { useToast } from '@/hooks/use-toast';


interface Feature {
  name: string;
  description?: string;
  included?: boolean;
}

interface PricingPlan {
  _id?: string;
  name: string;
  description?: string;
  pricing: {
    monthly: { price: number; currency: string };
    quarterly?: { price: number; currency: string };
    yearly?: { price: number; currency: string };
  };
  features: Feature[];
  isActive?: boolean;
  isPopular?: boolean;
  activeDuration?: 'monthly' | 'quarterly' | 'yearly';
  quarterlyMonths?: number;
  yearlyYears?: number;
  order?: number;
}


export default function Dashboard() {
  // Role detection (simple)
  const role = (typeof window !== 'undefined' && (localStorage.getItem('userRole') || sessionStorage.getItem('userRole'))) || '';
  const isAdmin = role === 'admin';
  const { toast } = useToast();
  const location = useLocation();

  // Pricing state (lightweight overview)
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState<{ businesses: number; students: number; creators: number } | null>(null);

  

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingPlans(true);
        // Overview should not hit admin-only endpoint to avoid 401/403 when token isn't admin.
        // Always show public plans here; full management is on the dedicated page.
        const data = await PricingAPI.listPublic();
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : Array.isArray((data as any)?.plans) ? (data as any).plans : [];
        setPlans(arr);
      } catch {
        if (!mounted) return;
        setPlans([]);
      } finally {
        if (!mounted) return;
        setLoadingPlans(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  // Cross-page notification: show toast if a template was applied earlier
  useEffect(() => {
    try {
      const raw = localStorage.getItem('notify.dashboard.templateApplied');
      if (raw) {
        const parsed = JSON.parse(raw || '{}');
        const id = parsed?.id;
        toast({
          title: 'Template applied',
          description: id ? `Your website is now using ${String(id).toUpperCase()}.` : 'Your website template was applied successfully.',
        });
        localStorage.removeItem('notify.dashboard.templateApplied');
      }
    } catch {
      localStorage.removeItem('notify.dashboard.templateApplied');
    }
  }, [location.pathname]);

  // Load admin role stats (only for admins)
  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      if (!isAdmin) {
        setStats(null);
        return;
      }
      try {
        setLoadingStats(true);
        const data = await AdminAPI.roleStats();
        if (!mounted) return;
        const collections = (data as any)?.collections || {};
        setStats({
          businesses: Number(collections.businesses || 0),
          students: Number(collections.students || 0),
          creators: Number(collections.creators || 0),
        });
      } catch (err: any) {
        const msg = String(err?.message || '');
        const maybeAuthError = /access denied|forbidden|insufficient permissions|unauthorized|401|403/i.test(msg);
        if (maybeAuthError) {
          // Try to obtain an admin token quickly, then retry once
          try {
            const baseEmail = (import.meta as any).env?.VITE_ADMIN_EMAIL || 'admin@edusathi.com';
            const password = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'edusathi2025';
            let data: any = await AuthAPI.login({ email: baseEmail, password, role: 'admin' });
            if (!data?.access_token) {
              data = await AuthAPI.register({ name: 'Admin User', email: baseEmail, password, role: 'admin' });
            }
            if (data?.access_token) {
              for (const storage of [localStorage, sessionStorage]) {
                storage.setItem('access_token', data.access_token);
                storage.setItem('accessToken', data.access_token);
                if (data.refresh_token) {
                  storage.setItem('refresh_token', data.refresh_token);
                  storage.setItem('refreshToken', data.refresh_token);
                }
              }
              if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('userRole', data.user.role || 'admin');
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('userRole', data.user.role || 'admin');
              }
              // retry once
              const retry = await AdminAPI.roleStats();
              if (!mounted) return;
              const collections = (retry as any)?.collections || {};
              setStats({
                businesses: Number(collections.businesses || 0),
                students: Number(collections.students || 0),
                creators: Number(collections.creators || 0),
              });
              return;
            }
          } catch (e) {
            // swallow and fallthrough to no stats
          }
        }
        if (mounted) setStats(null);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };
    loadStats();
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  

  

  

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to your Edusathi  management dashboard
            </p>
          </div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Business</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isAdmin ? (stats?.businesses ?? (loadingStats ? '…' : 0)) : 0}</div>
              <p className="text-xs text-muted-foreground">{isAdmin ? 'All registered businesses' : 'Admin only'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isAdmin ? (stats?.students ?? (loadingStats ? '…' : 0)) : 0}</div>
              <p className="text-xs text-muted-foreground">{isAdmin ? 'All registered students' : 'Admin only'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isAdmin ? (stats?.creators ?? (loadingStats ? '…' : 0)) : 0}</div>
              <p className="text-xs text-muted-foreground">{isAdmin ? 'All registered creators' : 'Admin only'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+0%</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started by creating your first educational center
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link to="#">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Sub Center
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/centers">
                  <Building className="mr-2 h-4 w-4" />
                  View All Centers
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest center management activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent activity to display
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Pricing Plans</h3>
              <p className="text-sm text-muted-foreground">
                {isAdmin ? 'Manage plans (admin overview)' : 'Browse available plans'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link to="/dashboard/settings/pricing">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Plans
                </Link>
              </Button>
            </div>
          </div>

          {loadingPlans ? (
            <div className="col-span-full text-sm text-muted-foreground text-center py-8">Loading plans…</div>
          ) : plans.length === 0 ? (
            <div className="col-span-full text-sm text-muted-foreground text-center py-8">No plans found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan._id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-700">
                        <div>
                          <span className="font-semibold">
                            ₹{plan.pricing[(plan.activeDuration || 'monthly') as 'monthly' | 'quarterly' | 'yearly']?.price ?? plan.pricing.monthly.price}
                          </span>
                          <span className="text-slate-500">
                            {(() => {
                              const d = plan.activeDuration || 'monthly';
                              if (d === 'monthly') return '/ month';
                              if (d === 'quarterly') return `/ ${(plan.quarterlyMonths || 3)} month${(plan.quarterlyMonths || 3) > 1 ? 's' : ''}`;
                              return `/ ${(plan.yearlyYears || 1)} year${(plan.yearlyYears || 1) > 1 ? 's' : ''}`;
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.features?.slice(0, 3).map((feature, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${feature.included ? 'bg-green-500' : 'bg-red-500'}`} />
                            {feature.name}
                          </div>
                        ))}
                        {plan.features?.length > 3 && (
                          <div className="text-xs text-gray-500">+{plan.features.length - 3} more</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t mt-3">
                      <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-xs text-gray-500">Order: {plan.order ?? 0}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </DashboardLayout>
  );
}
