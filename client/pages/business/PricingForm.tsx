import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Building,
  Globe,
  CreditCard,
  LayoutDashboard,
  User,
  FileText,
  HelpCircle,
  Settings,
  LayoutTemplate,
} from "lucide-react";
import { PaymentAPI } from "@/Api/api";
import RoleDashboardLayout from "@/components/RoleDashboardLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FormData {
  brandName: string;
  ownerName: string;
  domainName: string;
  email: string;
  phone: string;
  selectedPlan: {
    name: string;
    price: number;
    billing: "monthly" | "quarterly" | "yearly";
  };
}

export default function PricingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    brandName: "",
    ownerName: "",
    domainName: "",
    email: "",
    phone: "",
    selectedPlan: {
      name: searchParams.get("plan") || "Professional",
      price: parseInt(searchParams.get("price") || "79"),
      billing:
        (searchParams.get("billing") as "monthly" | "quarterly" | "yearly") ||
        "monthly",
    },
  });

  // Sidebar profile state (match BusinessDashboard behavior)
  const [profile, setProfile] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

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
      storage.removeItem("businessTemplate");
      storage.removeItem("businessAvatarUrl");
      storage.removeItem("planPurchased");
      storage.removeItem("businessEmail");
      storage.removeItem("businessDomain");
    }
    navigate("/auth?role=business", { replace: true });
  }

  const totalSteps = 3;
  const stepTitles = [
    "Institute Details",
    "Owner Information",
    "Review & Payment",
  ];

  // Sidebar navigation (same as BusinessDashboard)
  const navigationItems = [
    { title: "Dashboard", href: "/business", icon: LayoutDashboard, isActive: location.pathname === "/business", isExpandable: false as const },
    { title: "Profile", href: "/business/account", icon: User, isActive: location.pathname.startsWith("/business/account"), isExpandable: false as const },
    { title: "Subscription Plan", href: "/business/subscription-plan", icon: CreditCard, isActive: location.pathname.startsWith("/business/subscription-plan"), isExpandable: false as const },
    { title: "Setup Details", href: "/business/setup", icon: Settings, isActive: location.pathname.startsWith("/business/setup"), isExpandable: false as const },
    { title: "Template", href: "/business/templates", icon: LayoutTemplate, isActive: location.pathname.startsWith("/business/templates"), isExpandable: false as const },
    { title: "Subscription Details", href: "/business/subscription-details", icon: FileText, isActive: location.pathname.startsWith("/business/subscription-details"), isExpandable: false as const },
    { title: "Help & Contact", href: "/business/contact", icon: HelpCircle, isActive: location.pathname.startsWith("/business/contact"), isExpandable: false as const },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create payment order
      const orderData = {
        amount: formData.selectedPlan.price * 100, // Razorpay expects amount in paise
        currency: "INR",
        institute: formData.brandName,
        owner: formData.ownerName,
        email: formData.email,
        plan: formData.selectedPlan.name,
        billing: formData.selectedPlan.billing,
        durationDays:
          formData.selectedPlan.billing === "monthly"
            ? 30
            : formData.selectedPlan.billing === "quarterly"
            ? 90
            : 365,
        domain: formData.domainName,
      };

      const order = await PaymentAPI.createOrder(orderData);

      if (!order.success) {
        throw new Error(order.error || "Failed to create order");
      }

      // Get Razorpay config
      const config = await PaymentAPI.getConfig();

      // Initialize Razorpay payment
      const options = {
        key: config.key_id,
        amount: order.order.amount,
        currency: order.order.currency,
        name: "Edusathi",
        description: `${formData.selectedPlan.name} Plan - ${formData.brandName}`,
        order_id: order.order.id,
        prefill: {
          name: formData.ownerName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3B82F6",
        },
        handler: async function (response: any) {
          // Verify payment
          try {
            const verification = await PaymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              toast({
                title: "Payment Successful!",
                description: "Your institute is being set up. Redirecting...",
                variant: "default",
              });
              // Mark user as authenticated so ProtectedRoute allows access
              localStorage.setItem("isLoggedIn", "true");
              // Mark that a plan has been purchased so Admin page triggers countdown redirect
              localStorage.setItem("planPurchased", "true");
              // Persist identifiers so BusinessDashboard can fetch subscription if profile email is absent
              localStorage.setItem("businessEmail", formData.email);
              localStorage.setItem("businessDomain", formData.domainName);
              // Optionally, delay slightly to show toast before redirect
              setTimeout(() => {
                // Go to Admin page first; it will auto-redirect to /business/templates after 10s
                navigate("/admin");
              }, 800);
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verification.error || "Please contact support.",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
          },
        },
      };

      // Load Razorpay script and open checkout
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.brandName.trim() !== "" && formData.domainName.trim() !== ""
        );
      case 2:
        return formData.ownerName.trim() !== "" && formData.email.trim() !== "";
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <RoleDashboardLayout
      title="Business Dashboard"
      navigationItems={navigationItems}
      sidebarProfile={
        <div className="flex items-center gap-3">
          <button
            className="rounded-full"
            onClick={() => navigate("/business/account")}
            title="Profile"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={profile?.name || "B"} />
              <AvatarFallback>
                {(profile?.name || profile?.email || "B").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-1">{profile?.name || "Business User"}</span>
            <span className="text-xs text-muted-foreground">View profile</span>
          </div>
        </div>
      }
      sidebarFooter={<Button className="w-full" size="sm" variant="destructive" onClick={logout}>Logout</Button>}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Edusathi</span>
          </Link>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
      </header> */}

        <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              Setup Your Institute
            </h1>
            <span className="text-sm text-slate-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {stepTitles.map((title, index) => (
              <span
                key={index}
                className={`text-xs ${
                  index + 1 <= currentStep
                    ? "text-blue-600 font-medium"
                    : "text-slate-400"
                }`}
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {stepTitles[currentStep - 1]}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 &&
                    "Tell us about your institute and choose your domain"}
                  {currentStep === 2 &&
                    "We need some details about the institute owner"}
                  {currentStep === 3 &&
                    "Review your details and proceed to payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Institute Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="brandName">Institute/Brand Name *</Label>
                      <Input
                        id="brandName"
                        value={formData.brandName}
                        onChange={(e) =>
                          handleInputChange("brandName", e.target.value)
                        }
                        placeholder="e.g. ABC Institute of Technology"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="domainName">
                        Preferred Domain Name *
                      </Label>
                      <Input
                        id="domainName"
                        value={formData.domainName}
                        onChange={(e) =>
                          handleInputChange("domainName", e.target.value)
                        }
                        placeholder="your-institute.com"
                        className="mt-1"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        This will be your institute's custom domain
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Owner Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="ownerName">
                        Owner/Director Full Name *
                      </Label>
                      <Input
                        id="ownerName"
                        value={formData.ownerName}
                        onChange={(e) =>
                          handleInputChange("ownerName", e.target.value)
                        }
                        placeholder="e.g. Dr. John Smith"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="director@yourinstitute.com"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Payment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Institute Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Institute Name:
                          </span>
                          <span className="font-medium">
                            {formData.brandName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Domain:</span>
                          <span className="font-medium">
                            {formData.domainName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Owner:</span>
                          <span className="font-medium">
                            {formData.ownerName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="font-medium">{formData.email}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Selected Plan
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Plan:</span>
                          <Badge className="bg-blue-600">
                            {formData.selectedPlan.name}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Billing:</span>
                          <span className="font-medium capitalize">
                            {formData.selectedPlan.billing === 'monthly'
                              ? 'Monthly'
                              : formData.selectedPlan.billing === 'quarterly'
                              ? '3 months'
                              : 'Yearly'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Amount:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ₹{formData.selectedPlan.price}/
                            {formData.selectedPlan.billing === 'monthly'
                              ? 'month'
                              : formData.selectedPlan.billing === 'quarterly'
                              ? '3 months'
                              : 'year'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600"
                    >
                      <CreditCard className="w-4 h-4" />
                      Proceed to Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {formData.selectedPlan.name} Plan
                    </h3>
                    <p className="text-sm text-slate-600">
                      {formData.selectedPlan.billing === 'monthly'
                        ? 'Monthly'
                        : formData.selectedPlan.billing === 'quarterly'
                        ? '3 months'
                        : 'Yearly'}{" "}
                      billing
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{formData.selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Setup Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ₹{formData.selectedPlan.price}
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Check className="w-4 h-4" />
                    <span>14-day free trial included</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </RoleDashboardLayout>
  );
}
