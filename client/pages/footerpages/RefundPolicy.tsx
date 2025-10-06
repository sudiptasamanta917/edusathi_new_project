// src/pages/RefundPolicy.tsx
import React, { useEffect, useState } from "react";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "consumerRights", title: "Legal Framework & Consumer Rights" },
  { id: "businessRefunds", title: "Business Plan Cancellation & Refunds" },
  { id: "creatorRefunds", title: "Creator Account Cancellation & Revenue" },
  { id: "studentRefunds", title: "Student Subscription & Course Refunds" },
  { id: "exceptionalRefunds", title: "Exceptional Refund Circumstances" },
  { id: "refundProcess", title: "Refund Process & Procedures" },
  { id: "cancellationCharges", title: "Cancellation Charges & Penalties" },
  { id: "disputeResolution", title: "Dispute Resolution Process" },
  { id: "accountClosure", title: "Account Closure & Data Handling" },
  { id: "specialProvisions", title: "Special Provisions for Institutions" },
  { id: "internationalRefunds", title: "International Users & Currency" },
  { id: "contact", title: "Contact Information & Support" },
  { id: "policyUpdates", title: "Policy Updates & Modifications" },
];

const RefundPolicy = () => {
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
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Cancellation & Refund Policy - EduSathi
        </h1>

        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            This Cancellation and Refund Policy defines terms for cancellations,
            refunds, and service termination for EduSathi services, aligned with
            the Consumer Protection Act, 2019, and related rules.
          </p>
        </section>

        <section id="consumerRights" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Legal Framework & Consumer Rights
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Users are recognized as "consumers" under Indian law and have rights
            to protection against unfair practices, redressal, and refunds for
            defective or misrepresented services.
          </p>
        </section>

        <section id="businessRefunds" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Business Plan Cancellation & Refunds
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Free Trial:</strong> Cancel anytime, no charges.
            <br />
            <strong>Annual Plan (₹7,500):</strong> Refunds based on activation timeline:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>0-15 days: 100%</li>
            <li>16-30 days: 90%</li>
            <li>31-60 days: 75%</li>
            <li>61-90 days: 50%</li>
            <li>After 90 days: No refund</li>
          </ul>
        </section>

        <section id="creatorRefunds" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Creator Account Cancellation & Revenue
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Free Account:</strong> Immediate cancellation, pending earnings paid within 30 days.
            <br />
            <strong>Premium Account (₹999/month):</strong> Refund within 7 days: 100%, 8-15 days: 50%, after 15 days: no refund.
          </p>
        </section>

        <section id="studentRefunds" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Student Subscription & Course Refunds
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Monthly Subscription (₹499):</strong> 7 days: 100%, 8-15 days: 50%, after 15 days: no refund.
            <br />
            <strong>Annual Subscription (₹4,999):</strong> 15 days: 100%, 16-30 days: 90%, 31-90 days: 75%, 91-180 days: 50%, after 180 days: no refund.
            <br />
            <strong>Course Purchases:</strong> Refund eligibility: request within 45 days, &lt;25% content completed, no certificate downloaded, assessments not submitted.
          </p>
        </section>

        <section id="exceptionalRefunds" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Exceptional Refund Circumstances
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Full refunds may be provided for technical issues (&gt;72hrs), misrepresentation, course cancellation, medical emergencies, or bereavement.
          </p>
        </section>

        <section id="refundProcess" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Refund Process & Procedures
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Submit via online form or email (refunds@edusathi.net) with order ID, date, reason, and supporting docs. Processing: 15-30 business days.
          </p>
        </section>

        <section id="cancellationCharges" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Cancellation Charges & Penalties
          </h2>
          <p className="text-gray-700 leading-relaxed">
            No charges for subscription cancellations before service delivery or within cooling-off periods. Late cancellation charges may apply for setup/customization or content processing.
          </p>
        </section>

        <section id="disputeResolution" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Dispute Resolution Process</h2>
          <p className="text-gray-700 leading-relaxed">
            Internal resolution via support within 48h, escalation to supervisor 7 days, management 15 days. External: Consumer forums, helpline 1915, Ombudsman, or legal action.
          </p>
        </section>

        <section id="accountClosure" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Account Closure & Data Handling
          </h2>
          <p className="text-gray-700 leading-relaxed">
            User-initiated or platform-initiated. 30-day grace period for data export. Personal data deleted within 90 days, financial records retained 7 years, content archived for student access.
          </p>
        </section>

        <section id="specialProvisions" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Special Provisions for Institutions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Bulk cancellations, prorated refunds, migration support, and flexible terms for educational institutions, government, NGO, or special programs.
          </p>
        </section>

        <section id="internationalRefunds" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            International Users & Currency
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Refunds in original currency if possible, exchange rate adjustments, processing time extra 5-15 days, identity verification may be required.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Information & Support</h2>
          <ul className="text-gray-700 mt-2 space-y-1">
            <li>Email: refunds@edusathi.net</li>
            <li>Legal Compliance: legal@edusathi.net</li>
            <li>Customer Support: support@edusathi.net</li>
            <li>Emergency Hotline: 24/7 [number]</li>
            <li>Support Hours: 9:00 AM - 9:00 PM IST (Mon-Sat)</li>
          </ul>
        </section>

        <section id="policyUpdates" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Policy Updates & Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            Advance notice 30 days, email & platform notifications, grandfathering existing subscriptions. Seasonal/promotional changes communicated at purchase.
          </p>
        </section>
      </main>
    </div>
  );
};

export default RefundPolicy;
