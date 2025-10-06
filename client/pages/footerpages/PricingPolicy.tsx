// src/pages/PricingPolicy.tsx
import React, { useEffect, useState } from "react";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "businessPlans", title: "Business Plans" },
  { id: "creatorRevenue", title: "Creator Revenue Structure" },
  { id: "studentPricing", title: "Student Pricing" },
  { id: "paymentTerms", title: "Payment Methods & Terms" },
  { id: "gstTax", title: "GST & Tax Compliance" },
  { id: "discountsPromotions", title: "Discounts & Promotions" },
  { id: "currencyInternational", title: "Currency & International Pricing" },
  { id: "priceModification", title: "Price Modification Policy" },
  { id: "enterpriseSolutions", title: "Enterprise & Custom Solutions" },
  { id: "refundCancellation", title: "Refund & Cancellation Policy" },
  { id: "latePayment", title: "Late Payment & Collection Policy" },
  { id: "contact", title: "Contact Information" },
];

const PricingPolicy = () => {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 p-6 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block text-sm ${
                  activeSection === section.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pricing Policy - EduSathi</h1>

        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            This Pricing Policy outlines the cost structure, payment terms, and billing guidelines for all EduSathi services. Our transparent pricing ensures fair access to educational technology across businesses, creators, and students.
          </p>
        </section>

        <section id="businessPlans" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Business Plans</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Free Trial Plan:</strong> 30 days, ₹0, includes LMS access, basic analytics, 50 student registrations, and email support.<br/>
            <strong>Annual Business Plan:</strong> ₹7,500/year, unlimited LMS access, full website customization, priority support, analytics, multi-branch management, API access, and dedicated account manager.
          </p>
        </section>

        <section id="creatorRevenue" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Creator Revenue Structure</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Revenue Sharing Model:</strong> Course sales: 70% creator, 30% EduSathi.<br/>
            Video Views: ₹2 per 1,000 views.<br/>
            MCQ Test Completions: ₹5 per assessment.<br/>
            Subscription Content: 60% creator, 40% platform.<br/>
            <strong>Premium Creator Account:</strong> ₹999/month, unlimited uploads, analytics, live streaming, priority content review.
          </p>
        </section>

        <section id="studentPricing" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Student Pricing</h2>
          <p className="text-gray-700 leading-relaxed">
            Free Access: ₹0, limited courses, basic profile, community participation.<br/>
            Premium Monthly: ₹499/month.<br/>
            Premium Annual: ₹4,999/year (17% savings).<br/>
            Individual Course Purchases: ₹299-₹2,999 depending on course content and certifications.
          </p>
        </section>

        <section id="paymentTerms" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Payment Methods & Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            Accepted: Credit/Debit Cards, Net Banking, UPI, Wallets, Bank Transfers.<br/>
            Auto-renewal unless cancelled 7 days before expiry. Failed payments: 7-day grace period. GST: 18% on all paid services.
          </p>
        </section>

        <section id="gstTax" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">GST & Tax Compliance</h2>
          <p className="text-gray-700 leading-relaxed">
            All paid services include 18% GST. Tax invoices generated automatically. Creator payments comply with TDS regulations.
          </p>
        </section>

        <section id="discountsPromotions" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Discounts & Promotions</h2>
          <p className="text-gray-700 leading-relaxed">
            Student discounts: Up to 40% for institutions, 25% for bulk subscriptions.<br/>
            Business volume discounts: 10-30% for 5+ to 50+ licenses.<br/>
            Promotional offers: Festival offers, referral rewards, early bird pricing.
          </p>
        </section>

        <section id="currencyInternational" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Currency & International Pricing</h2>
          <p className="text-gray-700 leading-relaxed">
            Prices in INR. International payments accepted with 3% processing fee and currency conversion. Regional pricing for Tier-2 & Tier-3 cities.
          </p>
        </section>

        <section id="priceModification" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Price Modification Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            30-day notice for existing subscribers. No mid-cycle increases. Current subscribers protected until next billing cycle.
          </p>
        </section>

        <section id="enterpriseSolutions" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Enterprise & Custom Solutions</h2>
          <p className="text-gray-700 leading-relaxed">
            Custom pricing for 100+ licenses, dedicated infrastructure, SLA commitments, on-premise options, consultation services, data migration, and premium support packages.
          </p>
        </section>

        <section id="refundCancellation" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Refund & Cancellation Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            Free trial: Cancel anytime, no charges.<br/>
            Annual business plan: 100% refund within 15 days, prorated 60-day refund.<br/>
            Creator & Student accounts follow similar timelines as per Terms & Conditions.
          </p>
        </section>

        <section id="latePayment" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Late Payment & Collection Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            2% per month overdue charge. Suspension after 15 days, termination after 60 days. Restoration fee: ₹500. Legal action for defaults &gt; ₹10,000 after 90 days.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            Billing: billing@edusathi.net<br/>
            Payment Disputes: disputes@edusathi.net (response within 48 hours)
          </p>
        </section>
      </main>
    </div>
  );
};

export default PricingPolicy;
