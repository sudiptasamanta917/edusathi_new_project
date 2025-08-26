import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactSection() {
  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-4" />,
      title: "Email Us",
      value: "support@edusathi.com",
      description: "We reply within 24 hours",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <Phone className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-4" />,
      title: "Call Us",
      value: "+91 98765 43210",
      description: "Mon-Fri 9AM-6PM IST",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <MapPin className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-4" />,
      title: "Visit Us",
      value: "Bangalore, India",
      description: "Schedule an appointment",
      color: "text-red-600 dark:text-red-400",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-500 dark:text-purple-400 mx-auto mb-4" />,
      title: "Live Chat",
      value: "Available 24/7",
      description: "Instant support",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section id="contact" className="container max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Get in Touch
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          Ready to transform your institute? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {contactMethods.map((method, index) => (
          <Card key={index} className="rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 text-center bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              {method.icon}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {method.title}
              </h3>
              <p className={`${method.color} font-medium mb-1`}>
                {method.value}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {method.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link to="/contact">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
            Contact Us
          </Button>
        </Link>
      </div>
    </section>
  );
}
