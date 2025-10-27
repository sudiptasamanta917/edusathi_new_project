import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { LayoutDashboard, User, CreditCard, FileText, HelpCircle, Settings, LayoutTemplate, ExternalLink, Server, Globe, Shield, Calendar, RefreshCw } from "lucide-react";
import Pricing from "./Pricing";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InstituteLanding from "@/components/templates/InstituteLanding";
import SplitLanding from "@/components/templates/SplitLanding";
import MinimalSpotlightLanding from "@/components/templates/MinimalSpotlightLanding";
import FeatureFirstLanding from "@/components/templates/FeatureFirstLanding";
import { CentersAPI, TemplatesAPI, PaymentAPI, ServicesAPI } from "@/Api/api";
import { useToast } from "@/hooks/use-toast";

export default function BusinessDashboard() {
  const [profile, setProfile] = useState<{ id?: string; name?: string; email?: string; role?: string } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [planPurchased, setPlanPurchased] = useState<boolean>(false);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    plan?: string;
    status?: string;
    subscriptionStartAt?: string | null;
    expiresAt?: string | null;
    instituteName?: string | null;
  } | null>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [billingLoading, setBillingLoading] = useState<boolean>(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    const p =
      sessionStorage.getItem("userProfile") ||
      localStorage.getItem("userProfile") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("user");
    setProfile(p ? JSON.parse(p) : null);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("businessAvatarUrl") || undefined;
    setAvatarUrl(u);
  }, []);

  useEffect(() => {
    // Initialize as false; will be updated from subscription lookup
    setPlanPurchased(false);
  }, []);

  // Preload per-email applied template for instant UI after login (before server lookup completes)
  useEffect(() => {
    try {
      const persistedUser = (() => {
        try {
          const u =
            sessionStorage.getItem("userProfile") ||
            localStorage.getItem("userProfile") ||
            sessionStorage.getItem("user") ||
            localStorage.getItem("user");
          return u ? JSON.parse(u) : null;
        } catch (_) {
          return null;
        }
      })();
      const email =
        profile?.email ||
        localStorage.getItem("businessEmail") ||
        persistedUser?.email ||
        undefined;
      const normEmail = typeof email === 'string' ? email.toLowerCase().trim() : undefined;
      const mapRaw = localStorage.getItem('businessTemplatesByEmail');
      if (normEmail && mapRaw) {
        const map = JSON.parse(mapRaw || '{}') || {};
        const t = map[normEmail];
        if (t && typeof t === 'string') {
          setSelectedTemplate(t);
        }
      }
    } catch { }
  }, [profile?.email]);

  // Preload applied template from localStorage so UI shows Applied on revisit and preview uses it
  useEffect(() => {
    const t = localStorage.getItem("businessTemplate");
    if (t) setSelectedTemplate(t);
  }, []);

  // Cross-page notification (business scope): show toast if a template was applied earlier
  useEffect(() => {
    try {
      const raw = localStorage.getItem('notify.business.templateApplied');
      if (raw) {
        const parsed = JSON.parse(raw || '{}');
        const id = parsed?.id;
        toast({
          title: 'Template applied',
          description: id ? `Your website is now using ${String(id).toUpperCase()}.` : 'Your website template was applied successfully.',
        });
        localStorage.removeItem('notify.business.templateApplied');
      }
    } catch {
      localStorage.removeItem('notify.business.templateApplied');
    }
  }, [location.pathname]);

  // Fetch subscription details for current business using best-available identifiers
  const refreshSubscription = () => {
    // Prefer authenticated profile email; fallback to values persisted by PricingForm
    const persistedUser = (() => {
      try {
        const u =
          sessionStorage.getItem("userProfile") ||
          localStorage.getItem("userProfile") ||
          sessionStorage.getItem("user") ||
          localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
      } catch (_) {
        return null;
      }
    })();
    const email =
      profile?.email ||
      localStorage.getItem("businessEmail") ||
      persistedUser?.email ||
      undefined;
    const domain = localStorage.getItem("businessDomain") || undefined;

    // Normalize to avoid case/whitespace mismatches
    const normEmail = typeof email === "string" ? email.toLowerCase().trim() : undefined;
    const normDomain = typeof domain === "string" ? domain.toLowerCase().trim() : undefined;
    if (normEmail && normEmail !== email) localStorage.setItem("businessEmail", normEmail);
    if (normDomain && normDomain !== domain) localStorage.setItem("businessDomain", normDomain);

    if (!normEmail && !normDomain) {
      // No identifiers yet (likely right after login). Skip without error; effects will retry later.
      return;
    }
    setSubError(null);
    setSubLoading(true);

    (async () => {
      try {
        let data: any | null = null;
        if (normEmail) {
          try {
            data = await CentersAPI.lookupByEmail(normEmail);
          } catch (_e) {
            data = null;
          }
        }
        if (!data && normDomain) {
          try {
            data = await CentersAPI.lookupByDomain(normDomain);
          } catch (_e) {
            data = null;
          }
        }
        if (!data) throw new Error("lookup failed");

        setSubscription({
          plan: data?.plan,
          status: data?.status,
          subscriptionStartAt: data?.subscriptionStartAt || null,
          expiresAt: data?.expiresAt || null,
          instituteName: data?.instituteName || null,
        });
        // Derive planPurchased from server data to avoid stale localStorage
        setPlanPurchased(!!(data?.status === "active" || data?.plan));
        // Sync selected template from server if available; if not yet available, keep current optimistic selection
        if (data?.templateId) {
          setSelectedTemplate(data.templateId);
          localStorage.setItem("businessTemplate", data.templateId);
          // Also persist per-email mapping for instant UI on next login
          try {
            if (normEmail) {
              const mapRaw = localStorage.getItem('businessTemplatesByEmail');
              const map = mapRaw ? JSON.parse(mapRaw) : {};
              map[normEmail] = data.templateId;
              localStorage.setItem('businessTemplatesByEmail', JSON.stringify(map));
            }
          } catch { }
        }
        if (data?.instituteName) {
          localStorage.setItem("businessInstituteName", data.instituteName);
        } else {
          localStorage.removeItem("businessInstituteName");
        }
      } catch {
        // Fallback: try to derive identifiers from billing purchases and retry once
        try {
          const resp: any = await PaymentAPI.myPurchases();
          const list: any[] = Array.isArray(resp?.purchases) ? resp.purchases : [];
          const paid = list.find((p) => p.status === 'paid') || list[0];
          const derivedEmail = typeof paid?.email === 'string' ? paid.email.toLowerCase().trim() : undefined;
          const derivedDomain = typeof paid?.domain === 'string' ? paid.domain.toLowerCase().trim() : undefined;
          if (derivedEmail) localStorage.setItem('businessEmail', derivedEmail);
          if (derivedDomain) localStorage.setItem('businessDomain', derivedDomain);
          let retry: any = null;
          if (derivedEmail) {
            try { retry = await CentersAPI.lookupByEmail(derivedEmail); } catch { retry = null; }
          }
          if (!retry && derivedDomain) {
            try { retry = await CentersAPI.lookupByDomain(derivedDomain); } catch { retry = null; }
          }
          if (retry) {
            setSubscription({
              plan: retry?.plan,
              status: retry?.status,
              subscriptionStartAt: retry?.subscriptionStartAt || null,
              expiresAt: retry?.expiresAt || null,
              instituteName: retry?.instituteName || null,
            });
            setPlanPurchased(!!(retry?.status === 'active' || retry?.plan));
            if (retry?.templateId) {
              setSelectedTemplate(retry.templateId);
              localStorage.setItem('businessTemplate', retry.templateId);
              try {
                if (normEmail) {
                  const mapRaw = localStorage.getItem('businessTemplatesByEmail');
                  const map = mapRaw ? JSON.parse(mapRaw) : {};
                  map[normEmail] = retry.templateId;
                  localStorage.setItem('businessTemplatesByEmail', JSON.stringify(map));
                }
              } catch { }
            }
            if (retry?.instituteName) {
              localStorage.setItem('businessInstituteName', retry.instituteName);
            } else {
              localStorage.removeItem('businessInstituteName');
            }
            return; // success via fallback
          }
        } catch { }
        setSubscription(null);
        setPlanPurchased(false);
        setSubError("No active subscription found.");
        // Do not clear template selection here to avoid flicker after immediate apply
      } finally {
        setSubLoading(false);
      }
    })();
  };

  // Fetch billing history for authenticated business
  const refreshBilling = () => {
    setBillingError(null);
    setBillingLoading(true);
    (async () => {
      try {
        const data: any = await PaymentAPI.myPurchases();
        const list = Array.isArray(data?.purchases) ? data.purchases : [];
        setPurchases(list);
      } catch (e) {
        setPurchases([]);
        setBillingError("Could not load billing history.");
      } finally {
        setBillingLoading(false);
      }
    })();
  };

  // Fetch services by business ID
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      
      const persistedUser = (() => {
        try {
          const u =
            sessionStorage.getItem("userProfile") ||
            localStorage.getItem("userProfile") ||
            sessionStorage.getItem("user") ||
            localStorage.getItem("user");
          return u ? JSON.parse(u) : null;
        } catch (_) {
          return null;
        }
      })();
      
      const businessId = profile?.id || persistedUser?.id;
      
      if (!businessId) {
        throw new Error("Business ID not found");
      }

      const response = await ServicesAPI.getServicesByBusinessId(businessId);
      
      console.log('Services API Response:', response);
      console.log('Services data:', response.services);
      
      if (response.success) {
        setServices(response.services || []);
        console.log('Services set in state:', response.services);
      } else {
        throw new Error(response.message || "Failed to fetch services");
      }
    } catch (error: any) {
      console.error("Failed to fetch services:", error);
      setServicesError(error.message || "Failed to load services");
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
    refreshBilling();
  }, [profile?.email]);

  // Fetch services when profile is available
  useEffect(() => {
    if (profile?.id) {
      fetchServices();
    }
  }, [profile?.id]);

  // Also refresh subscription when navigating to relevant pages
  useEffect(() => {
    const p = location.pathname;
    if (
      p.startsWith("/business/templates") ||
      p.startsWith("/business/subscription-plan") ||
      p.startsWith("/business/subscription-details")
    ) {
      refreshSubscription();
      refreshBilling();
    }
  }, [location.pathname, profile?.email]);

  // Refresh on window focus (returning from payment or switching tabs)
  useEffect(() => {
    const onFocus = () => {
      refreshSubscription();
      refreshBilling();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [profile?.email]);

  const onUploadAvatar = () => {
    if (!avatarFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem("businessAvatarUrl", dataUrl);
      setAvatarUrl(dataUrl);
      setAvatarFile(null);
    };
    reader.readAsDataURL(avatarFile);
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
      // Business-specific keys to prevent old session leakage
      storage.removeItem("businessTemplate");
      storage.removeItem("businessAvatarUrl");
      storage.removeItem("planPurchased");
      storage.removeItem("businessEmail");
      storage.removeItem("businessDomain");
    }
    navigate("/auth?role=business", { replace: true });
  }

  const chooseTemplate = (id: string) => {
    // Set in-memory for preview. Applying will persist via API.
    setSelectedTemplate(id);
    navigate("/business/website");
  };

  const applyTemplate = async (id: string) => {
    try {
      setApplyingId(id);
      // Secure, JWT-authenticated endpoint updates Center by current user and stores selection history
      const resp: any = await TemplatesAPI.apply(id);
      localStorage.setItem("businessTemplate", id);
      setSelectedTemplate(id);
      // Signal dashboard to show a notification toast on next visit
      try {
        // Admin/global dashboard notification
        localStorage.setItem(
          "notify.dashboard.templateApplied",
          JSON.stringify({ id, ts: Date.now() })
        );
        // Business dashboard-specific notification so we don't consume the admin one
        localStorage.setItem(
          "notify.business.templateApplied",
          JSON.stringify({ id, ts: Date.now() })
        );

      } catch { }
      // Persist per-email mapping so next login preloads instantly
      try {
        const persistedUser = (() => {
          try {
            const u =
              sessionStorage.getItem("userProfile") ||
              localStorage.getItem("userProfile") ||
              sessionStorage.getItem("user") ||
              localStorage.getItem("user");
            return u ? JSON.parse(u) : null;
          } catch (_) {
            return null;
          }
        })();
        const userId =
          profile?.id ||
          localStorage.getItem("businessId") ||
          persistedUser?.id ||
          undefined;
        if (userId) {
          // Create the API call for starting the service with user ID
          console.log("services start => ", userId);
          ServicesAPI.createService({
            templateId: id,
            businessId: userId
          }).then(res => {
            // Handle successful service creation
            toast({
              title: "Service created",
              description: `Your service has been created successfully on port ${res.port || 'assigned'}.`
            });
            // Refresh services after successful creation
            fetchServices();
          }).catch(err => {
            toast({
              title: "Error",
              description: `Failed to create service: ${err.response?.data?.error || err.message}`,
              variant: "destructive"
            });
          });
        } else {
          console.warn('No user ID found in session');
          toast({
            title: "Warning",
            description: "User ID not found. Please login again.",
            variant: "destructive"
          });
        }
        
        const email =
          profile?.email ||
          localStorage.getItem("businessEmail") ||
          persistedUser?.email ||
          undefined;
        const normEmail = typeof email === 'string' ? email.toLowerCase().trim() : undefined;
        if (normEmail) {
          const mapRaw = localStorage.getItem('businessTemplatesByEmail');
          const map = mapRaw ? JSON.parse(mapRaw) : {};
          map[normEmail] = id;
          localStorage.setItem('businessTemplatesByEmail', JSON.stringify(map));
        }
      } catch { }
      if (resp?.alreadyApplied) {
        toast({ title: "Already applied", description: `You're already using ${id.toUpperCase()}.` });
      } else {
        toast({ title: "Template applied", description: `Your website will use ${id.toUpperCase()}.` });
      }
      // Refresh subscription to sync any Center data updates (e.g., instituteName)
      refreshSubscription();
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "Failed to apply template";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setApplyingId(null);
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Build navigation for RoleDashboardLayout
  const navigationItems = [
    { title: "Dashboard", href: "/business", icon: LayoutDashboard, isActive: location.pathname === "/business", isExpandable: false as const },
    { title: "Profile", href: "/business/account", icon: User, isActive: location.pathname.startsWith("/business/account"), isExpandable: false as const },
    { title: "Subscription Plan", href: "/business/subscription-plan", icon: CreditCard, isActive: location.pathname.startsWith("/business/subscription-plan"), isExpandable: false as const },
    { title: "Setup Details", href: "/business/setup", icon: Settings, isActive: location.pathname.startsWith("/business/setup"), isExpandable: false as const },
    { title: "Template", href: "/business/templates", icon: LayoutTemplate, isActive: location.pathname.startsWith("/business/templates"), isExpandable: false as const },
    { title: "Subscription Details", href: "/business/subscription-details", icon: FileText, isActive: location.pathname.startsWith("/business/subscription-details"), isExpandable: false as const },
    { title: "Help & Contact", href: "/business/contact", icon: HelpCircle, isActive: location.pathname.startsWith("/business/contact"), isExpandable: false as const },
  ];

  return (
    <RoleDashboardLayout
      title="Business Dashboard"
      navigationItems={navigationItems}
      sidebarProfile={
        <div className="flex items-center gap-3">
          <button className="rounded-full" onClick={() => navigate("/business/account")} title="Profile">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={profile?.name || "B"} />
              <AvatarFallback>{(profile?.name || profile?.email || "B").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-1 text-slate-900 dark:text-slate-100">{profile?.name || "Business User"}</span>
            <span className="text-xs text-muted-foreground dark:text-slate-400">View profile</span>
          </div>
        </div>
      }
      sidebarFooter={<Button className="w-full" size="sm" variant="destructive" onClick={logout}>Logout</Button>}
    >
      {/* Main content */}
      <div className="space-y-6">
        {location.pathname.startsWith("/business/subscription-plan") ? (
          <div>
            <Pricing />
          </div>
        ) : location.pathname.startsWith("/business/templates") ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1,].map((n) => (
              <Card
                key={n}
                className={`rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${selectedTemplate === ('t' + n) ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Template {n}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Select to create your website home</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                    <h1 className="text-3xl font-bold text-center m-10 text-slate-800 dark:text-slate-200">Choose your Template</h1>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => applyTemplate(`t${n}`)}
                      disabled={applyingId === `t${n}` || !planPurchased || selectedTemplate === `t${n}`}
                      title={
                        selectedTemplate === `t${n}`
                          ? 'This template is already applied'
                          : (!planPurchased ? 'Purchase a plan to apply this template' : undefined)
                      }
                    >
                      {selectedTemplate === `t${n}` ? "Applied" : "Apply"}
                    </Button>
                    <Button onClick={() => chooseTemplate(`t${n}`)}>View Template</Button>
                    {!planPurchased && (
                      <Button variant="outline" onClick={() => navigate("/business/subscription-plan")}>
                        View Plans
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : location.pathname.startsWith("/business/website") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Your Business Website</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Public home generated from your selected template.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const t = selectedTemplate || "t1";
                  const brand = subscription?.instituteName || localStorage.getItem("businessInstituteName") || profile?.name || "Your Institute";
                  if (t === "t1") return <InstituteLanding brandName={brand} />;
                  if (t === "t2") return <SplitLanding brandName={brand} />;
                  if (t === "t3") return <MinimalSpotlightLanding brandName={brand} />;
                  return <FeatureFirstLanding brandName={brand} />;
                })()}
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/account") ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Organization Profile</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Your business account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={profile?.name || "B"} />
                    <AvatarFallback>{(profile?.name || profile?.email || "B").slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-2">
                    <div>
                      <Label htmlFor="biz-avatar" className="text-slate-900 dark:text-slate-100">Profile picture</Label>
                      <Input id="biz-avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                      <Button size="sm" onClick={onUploadAvatar} disabled={!avatarFile}>Upload Avatar</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-700 dark:text-slate-300"><strong>Admin:</strong> {profile?.name || "-"}</p>
                  <p className="text-slate-700 dark:text-slate-300"><strong>Email:</strong> {profile?.email || "-"}</p>
                  <p className="text-slate-700 dark:text-slate-300"><strong>Role:</strong> {profile?.role || "business"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Service Details
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Your deployed services and infrastructure
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchServices}
                  disabled={servicesLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${servicesLoading ? 'animate-spin' : ''}`} />
                  {servicesLoading ? "Loading..." : "Refresh"}
                </Button>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">Loading services...</span>
                  </div>
                ) : servicesError ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 dark:text-red-400 mb-2">Failed to load services</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{servicesError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchServices}
                      className="mt-3"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-400">No services deployed yet</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                      Apply a template to create your first service
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => navigate("/business/templates")}
                    >
                      Create Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {service.instituteName || 'Unknown Service'}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(service.status)}`}>
                            {service.status || 'unknown'}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">Website:</span>
                              <a 
                                href={`https://${service.domain}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 max-w-xs truncate"
                                title={service.domain}
                              >
                                {service.domain}
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">Admin Panel:</span>
                              <a 
                                href={`https://${service.subdomain}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 max-w-xs truncate"
                                title={service.subdomain}
                              >
                                {service.subdomain}
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 dark:text-slate-400 font-medium">Created:</span>
                              <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(service.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {service.status === 'running' && (
                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(`https://${service.domain}`, '_blank')}
                                className="flex-1"
                              >
                                <Globe className="h-3 w-3 mr-1" />
                                Visit Website
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(`https://${service.subdomain}`, '_blank')}
                                className="flex-1"
                              >
                                <Server className="h-3 w-3 mr-1" />
                                Admin Panel
                              </Button>
                            </div>
                          </div>
                        )}

                        {service.status === 'pending' && (
                          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                              ⏳ Service is being deployed. This may take a few minutes.
                            </p>
                          </div>
                        )}

                        {service.status === 'failed' && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="text-red-700 dark:text-red-300 text-xs">
                              ❌ Service deployment failed. Please try creating the service again.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {services.length > 0 && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            Total Services: <strong>{services.length}</strong>
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            Running: <strong className="text-green-600">{services.filter(s => s.status === 'running').length}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/setup") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Setup Details</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Complete your business profile and onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Business profile configuration</li>
                  <li>Payment setup</li>
                  <li>Branding and contact info</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/subscription-details") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Subscription Details</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Your current plan and billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { refreshSubscription(); refreshBilling(); }}
                  >
                    Refresh
                  </Button>
                </div>
                {subLoading ? (
                  <p className="text-slate-700 dark:text-slate-300">Loading subscription...</p>
                ) : subError ? (
                  <p className="text-slate-700 dark:text-slate-300">{subError}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-slate-700 dark:text-slate-300"><strong>Plan:</strong> {subscription?.plan || "—"}</p>
                    <p className="text-slate-700 dark:text-slate-300"><strong>Status:</strong> {(subscription?.status || "—").toString()}</p>
                    <p className="text-slate-700 dark:text-slate-300"><strong>Start date:</strong> {subscription?.subscriptionStartAt ? new Date(subscription.subscriptionStartAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</p>
                    <p className="text-slate-700 dark:text-slate-300"><strong>Next billing:</strong> {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</p>
                  </div>
                )}
                {/* Billing History */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Billing History</h3>
                  {billingLoading ? (
                    <p className="text-slate-700 dark:text-slate-300">Loading billing history...</p>
                  ) : billingError ? (
                    <p className="text-slate-700 dark:text-slate-300">{billingError}</p>
                  ) : purchases.length === 0 ? (
                    <p className="text-slate-700 dark:text-slate-300">No purchases yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {purchases.map((p) => (
                        <div key={p._id} className="flex items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 p-3">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-100 text-sm">{new Date(p.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                            <span className="text-slate-600 dark:text-slate-400 text-xs">{p.plan || '-'} · {p.domain || ''}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-900 dark:text-slate-100 text-sm">{p.currency || 'INR'} {Number(p.amount || 0) / 100}</div>
                            <div className="text-slate-600 dark:text-slate-400 text-xs">{(p.status || '—').toString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : location.pathname.startsWith("/business/contact") ? (
          <div className="grid gap-6">
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Help & Contact Us</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">We are here to help you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 mb-2">Email: support@example.com</p>
                <p className="text-slate-700 dark:text-slate-300">You can also reach us via the contact page.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Profile</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Organization profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-slate-700 dark:text-slate-300"><strong>Admin:</strong> {profile?.name || "-"}</p>
                  <p className="text-slate-700 dark:text-slate-300"><strong>Email:</strong> {profile?.email || "-"}</p>
                  <p className="text-slate-700 dark:text-slate-300"><strong>Role:</strong> {profile?.role || "business"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Service Details
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Your deployed services</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchServices}
                  disabled={servicesLoading}
                >
                  {servicesLoading ? "Loading..." : "Refresh"}
                </Button>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-slate-600 dark:text-slate-400">Loading...</span>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-4">
                    <Server className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-400">No services yet</p>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => navigate("/business/templates")}
                    >
                      Create Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {services.slice(0, 2).map((service, index) => (
                      <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {service.instituteName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Website:</span>
                            <a 
                              href={`https://${service.domain}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 hover:underline"
                              title={`Visit ${service.domain}`}
                            >
                              {service.domain}
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Admin:</span>
                            <a 
                              href={`https://${service.subdomain}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 hover:underline"
                              title={`Access admin panel at ${service.subdomain}`}
                            >
                              {service.subdomain}
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Created:</span>
                            <span className="text-slate-900 dark:text-slate-100 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(service.createdAt)}
                            </span>
                          </div>
                        </div>
                        {service.status === 'running' && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(`https://${service.domain}`, '_blank')}
                                className="flex-1"
                              >
                                <Globe className="h-3 w-3 mr-1" />
                                Visit Website
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(`https://${service.subdomain}`, '_blank')}
                                className="flex-1"
                              >
                                <Server className="h-3 w-3 mr-1" />
                                Admin Panel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {services.length > 2 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/business/account")}
                      >
                        View All Services ({services.length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </RoleDashboardLayout>
  );
}
