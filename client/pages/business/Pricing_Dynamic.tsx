import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Check,
  Star,
  Users,
  Building,
  Crown,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { apiGet } from "@/Api/api";

interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  pricing: {
    monthly: { price: number; currency: string };
    quarterly: { price: number; currency: string };
    yearly: { price: number; currency: string };
  };
  features: Array<{
    name: string;
    description: string;
    included: boolean;
  }>;
  isActive: boolean;
  isPopular: boolean;
  order: number;
}

export default function PricingDynamic() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiGet<PricingPlan[]>('/api/pricing');
      setPlans(response || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlanIcon = (index: number) => {
    const icons = [
      <Zap className="w-8 h-8 text-blue-500" />,
      <Building className="w-8 h-8 text-green-500" />,
      <Crown className="w-8 h-8 text-purple-500" />,
      <Shield className="w-8 h-8 text-orange-500" />,
      <Heart className="w-8 h-8 text-red-500" />,
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Edusathi</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/#features"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link to="/pricing" className="text-blue-600 font-medium">
              Pricing
            </Link>
            <Link
              to="/#about"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/get-started">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Transform your educational institute with our comprehensive platform.
            Select the plan that fits your needs and start your journey today.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-12">
            <Tabs value={billingCycle} onValueChange={(value: string) => setBillingCycle(value as 'monthly' | 'quarterly' | 'yearly')} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">3 months</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Pricing Cards */}
        {plans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-slate-600">No pricing plans available at the moment.</p>
            <p className="text-slate-500 mt-2">Please check back later or contact support.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan._id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.isPopular
                    ? "ring-2 ring-blue-500 shadow-xl scale-105"
                    : "hover:shadow-xl"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 pt-8">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(index)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {formatPrice(plan.pricing[billingCycle].price, plan.pricing[billingCycle].currency)}
                    </div>
                    <div className="text-slate-500">
                      per {billingCycle === 'yearly' ? 'year' : billingCycle === 'quarterly' ? '3 months' : 'month'}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Check className={`w-3 h-3 ${
                            feature.included ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div className="text-left">
                          <span className={`text-sm ${
                            feature.included ? 'text-slate-700' : 'text-slate-400 line-through'
                          }`}>
                            {feature.name}
                          </span>
                          {feature.description && (
                            <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/pricing/setup?plan=${encodeURIComponent(plan.name)}&price=${plan.pricing[billingCycle]?.price}&billing=${billingCycle}`}
                    className="block"
                  >
                    <Button
                      className={`w-full py-3 ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          : ""
                      }`}
                      variant={plan.isPopular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-slate-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-slate-600">
                  We offer a 14-day free trial for all our plans. No credit card required to get started.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-slate-600">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Do you offer discounts for educational institutions?
                </h3>
                <p className="text-slate-600">
                  Yes, we offer special pricing for educational institutions. Contact our sales team for more information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Institute?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of educational institutions already using Edusathi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-started">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
