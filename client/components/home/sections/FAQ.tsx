import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "How quickly can we get started with Edusathi?",
      a: "You can launch your institute online in less than 24 hours. Our guided onboarding process helps you set up everything from student enrollment to course creation.",
    },
    {
      q: "Is our data secure and compliant?",
      a: "Yes, we use enterprise-grade encryption and are GDPR compliant. All data is stored securely with regular backups and 99.9% uptime guarantee.",
    },
    {
      q: "What payment options do you support?",
      a: "We support all major payment gateways including Stripe, PayPal, Razorpay, and direct bank transfers. Students can pay via cards, UPI, net banking, and digital wallets.",
    },
    {
      q: "Do you integrate with existing systems?",
      a: "Yes, we have APIs and integrations for popular tools like Zoom, Google Workspace, Microsoft Teams, Slack, and many more. Custom integrations are also available.",
    },
    {
      q: "Can we customize the platform with our branding?",
      a: "Absolutely! Our white-label solution allows complete customization of colors, logos, domain, and branding to match your institute's identity.",
    },
    {
      q: "What kind of support do you provide?",
      a: "We offer 24/7 support via chat, email, and phone. Premium plans include dedicated account managers and priority support with guaranteed response times.",
    },
  ];

  return (
    <section className="container max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Frequently asked questions
        </h2>
        <p className="text-xl text-muted-foreground dark:text-slate-300">
          Everything you need to know about Edusathi
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-slate-200 dark:border-slate-700 rounded-2xl px-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
          >
            <AccordionTrigger className="text-left font-semibold hover:no-underline text-slate-900 dark:text-slate-100">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300 pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
