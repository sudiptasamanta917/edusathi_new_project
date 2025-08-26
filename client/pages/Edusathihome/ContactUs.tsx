import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  Globe,
} from "lucide-react";

export default function ContactUs() {

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      title: "Email Us",
      info: "support@edusathi.com",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone className="w-6 h-6 text-green-500 dark:text-green-400" />,
      title: "Call Us",
      info: "+91 98765 43210",
      description: "Mon-Fri 9AM-6PM IST",
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-500 dark:text-red-400" />,
      title: "Visit Us",
      info: "Bangalore, Karnataka, India",
      description: "Schedule an appointment",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
      title: "Live Chat",
      info: "Available 24/7",
      description: "Instant support",
    },
  ];

  const supportOptions = [
    {
      icon: <Headphones className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
      title: "Technical Support",
      description:
        "Get help with platform issues, integrations, and troubleshooting",
      action: "Get Technical Help",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-green-500 dark:text-green-400" />,
      title: "Training & Onboarding",
      description: "Learn how to use Edusathi effectively with guided sessions",
      action: "Schedule Training",
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
      title: "Sales Inquiry",
      description: "Questions about pricing, features, or custom solutions",
      action: "Talk to Sales",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      {/* <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edusathi
            </span>
          </div>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
          >
            Back to Home
          </Button>
        </div>
      </header> */}

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Get in Touch
            <br />
            We're Here to Help
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Have questions about Edusathi? Need support? Want to schedule a
            demo? Our team is ready to assist you every step of the way.
          </p>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((contact, index) => (
              <Card
                key={index}
                className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 text-center bg-white dark:bg-slate-800"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{contact.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                    {contact.info}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {contact.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                How Can We Help?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Choose the best way to get the support you need
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {supportOptions.map((option, index) => (
                <Card
                  key={index}
                  className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 text-center bg-white dark:bg-slate-800"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">{option.icon}</div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      {option.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      {option.description}
                    </p>
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white w-full"
                    >
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-16">
          <Card className="rounded-2xl border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 dark:shadow-slate-900/50">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Business Hours
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-slate-600 dark:text-slate-300">
                <div>
                  <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Support</h3>
                  <p>24/7 Chat Support</p>
                  <p>Email: 24/7</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Phone Support</h3>
                  <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p>IST (Indian Standard Time)</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Sales</h3>
                  <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                  <p>Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
