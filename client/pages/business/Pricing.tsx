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
  activeDuration?: 'monthly' | 'quarterly' | 'yearly';
  quarterlyMonths?: number;
  yearlyYears?: number;
  order: number;
}

export default function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiGet<PricingPlan[]>('/api/pricing');
      setPlans(response);
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Fallback to static plans if API fails
      setPlans(staticPlans);
    } finally {
      setLoading(false);
    }
  };

  const staticPlans: PricingPlan[] = [
    {
      _id: '1',
      name: "1 Year Plan",
      description: "Perfect for institutes starting their journey",
      pricing: {
        monthly: { price: 5000, currency: 'INR' },
        quarterly: { price: 14000, currency: 'INR' },
        yearly: { price: 50000, currency: 'INR' }
      },
      features: [
        { name: "From Control", description: "", included: true },
        { name: "Home Page", description: "", included: true },
        { name: "AI-Chatbot", description: "", included: true },
      ],
      isActive: true,
      isPopular: false,
      order: 1
    },
    {
      _id: '2',
      name: "3 Year Plan",
      description: "For institutes with medium-term commitment",
      pricing: {
        monthly: { price: 7000, currency: 'INR' },
        quarterly: { price: 20000, currency: 'INR' },
        yearly: { price: 70000, currency: 'INR' }
      },
      features: [
        { name: "From Control", description: "", included: true },
        { name: "Home Page", description: "", included: true },
        { name: "AI-Chatbot", description: "", included: true },
      ],
      isActive: true,
      isPopular: true,
      order: 2
    },
    {
      _id: '3',
      name: "5 Year Plan",
      description: "For institutes with long-term vision",
      pricing: {
        monthly: { price: 10000, currency: 'INR' },
        quarterly: { price: 28000, currency: 'INR' },
        yearly: { price: 100000, currency: 'INR' }
      },
      features: [
        { name: "From Control", description: "", included: true },
        { name: "Home Page", description: "", included: true },
        { name: "AI-Chatbot", description: "", included: true },
      ],
      isActive: true,
      isPopular: false,
      order: 3
    },
  ];

  const currencySymbol = (currency?: string) => {
    if (!currency) return '';
    switch (currency.toUpperCase()) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return currency;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
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
              About us
            </Link>
            <Link
              to="/#institutes"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Institutes
            </Link>
            <Link
              to="/#students"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Students
            </Link>
            <Link
              to="/#contact"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact us
            </Link>
          </nav>

        </div>
      </header> */}

      <main>
        {/* Hero Section */}
        <section className="container max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Choose the perfect{" "}
              <span className="bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                plan for you
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12">
              Start with a free trial. Upgrade or downgrade at any time. No
              hidden fees.
            </p>

          </div>
        </section>

        {/* Pricing Plans */}
        <section className="container max-w-7xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan._id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 h-full ${
                    plan.isPopular
                      ? "ring-2 ring-blue-200 dark:ring-blue-700 bg-white dark:bg-slate-800"
                      : "bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
                  }`}
                >
                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      {index === 0 && <Zap className="w-8 h-8 text-blue-500 dark:text-blue-400" />}
                      {index === 1 && <Building className="w-8 h-8 text-green-500 dark:text-green-400" />}
                      {index === 2 && <Crown className="w-8 h-8 text-purple-500 dark:text-purple-400" />}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {plan.description}
                    </CardDescription>
                    <div className="pt-4">
                      <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                        {currencySymbol(plan.pricing[(plan.activeDuration || 'monthly') as 'monthly' | 'quarterly' | 'yearly']?.currency)}
                        {plan.pricing[(plan.activeDuration || 'monthly') as 'monthly' | 'quarterly' | 'yearly']?.price}
                        <span className="text-lg font-normal text-slate-500 dark:text-slate-400">
                          {(() => {
                            const d = (plan.activeDuration || 'monthly') as 'monthly' | 'quarterly' | 'yearly';
                            if (d === 'monthly') return '/month';
                            if (d === 'quarterly') {
                              const m = plan.quarterlyMonths || 3;
                              return `/ ${m} month${m > 1 ? 's' : ''}`;
                            }
                            const y = plan.yearlyYears || 1;
                            return `/ ${y} year${y > 1 ? 's' : ''}`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Everything included:</h4>
                      {plan.features.filter((f) => f.included).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{feature.name}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={`/pricing/setup?plan=${encodeURIComponent(plan.name)}&price=${plan.pricing[(plan.activeDuration || 'monthly') as 'monthly' | 'quarterly' | 'yearly']?.price}&billing=${(plan.activeDuration || 'monthly')}`}
                    >
                      <Button
                        className={`w-full ${
                          plan.isPopular
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            : ""
                          }`}
                        variant={plan.isPopular ? "default" : "outline"}
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Still have questions? We're here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, all plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="rounded-2xl border-0 shadow-sm bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{faq.q}</h4>
                  <p className="text-slate-600 dark:text-slate-300">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container max-w-4xl mx-auto px-4 py-20 text-center">
          <Card className="rounded-2xl border-0 shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of educators who trust Edusathi
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 px-8"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
