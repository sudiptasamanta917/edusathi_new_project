// src/pages/ShippingPolicy.tsx
import React, { useEffect, useState } from "react";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "serviceDelivery", title: "Service Delivery Methods" },
  { id: "businessPlan", title: "Business Plan Delivery" },
  { id: "creatorAccount", title: "Creator Account Delivery" },
  { id: "studentServices", title: "Student Services Delivery" },
  { id: "technicalReq", title: "Technical Delivery Requirements" },
  { id: "accountSecurity", title: "Account Security Delivery" },
  { id: "activationTimeline", title: "Service Activation Timeline" },
  { id: "deliveryConfirmation", title: "Service Delivery Confirmation" },
  { id: "qualityAssurance", title: "Quality Assurance" },
  { id: "customerResponsibilities", title: "Customer Responsibilities" },
  { id: "deliveryIssues", title: "Delivery Issues and Resolution" },
  { id: "internationalDelivery", title: "International Service Delivery" },
  { id: "refunds", title: "Refund and Re-delivery" },
  { id: "contact", title: "Contact Information" },
];

const ShippingPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-8">Shipping Policy - EduSathi</h1>

        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            EduSathi provides exclusively digital educational services. This
            Shipping Policy outlines our service delivery procedures, activation
            timelines, and support processes. No physical shipping is involved.
          </p>
        </section>

        <section id="serviceDelivery" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Service Delivery Methods
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All services are delivered digitally via our online platform
            (edusathi.net), including LMS access, websites, content, and tools.
          </p>
        </section>

        <section id="businessPlan" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Business Plan Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Free Trial:</strong> Instant activation upon email verification.
            <br />
            <strong>Annual Plan (₹7,500):</strong> Activated within 24 hours,
            onboarding within 48 hours, custom website within 3-7 business days.
          </p>
        </section>

        <section id="creatorAccount" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Creator Account Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Free Account:</strong> Immediate dashboard access after
            verification.
            <br />
            <strong>Premium Account (₹999/month):</strong> Features unlocked
            automatically within 2 hours, priority support enabled.
          </p>
        </section>

        <section id="studentServices" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Student Services Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Free Registration:</strong> Instant access and community forum.
            <br />
            <strong>Premium Subscription:</strong> Immediate activation upon
            payment, content download within 15 minutes, certificate within 1 hour.
          </p>
        </section>

        <section id="technicalReq" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Technical Delivery Requirements
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Requires stable internet (2 Mbps+), modern browser (Chrome/Firefox/Edge/Safari),
            mobile iOS12+/Android8+, and minimum 1GB storage for offline downloads.
          </p>
        </section>

        <section id="accountSecurity" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Account Security Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            Credentials sent encrypted within 5 minutes, 2FA setup via SMS/email,
            password reset links in 2 minutes, instant security notifications.
          </p>
        </section>

        <section id="activationTimeline" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Service Activation Timeline</h2>
          <p className="text-gray-700 leading-relaxed">
            LMS: Instant | Basic Website: 24-48 hrs | Custom Domain: 2-3 business days
            | Advanced Customization: 3-7 business days | API Integration: 5-10 business days
          </p>
        </section>

        <section id="deliveryConfirmation" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Service Delivery Confirmation</h2>
          <p className="text-gray-700 leading-relaxed">
            Delivery verified via email, SMS, platform notifications, and
            onboarding calls for business customers.
          </p>
        </section>

        <section id="qualityAssurance" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quality Assurance</h2>
          <p className="text-gray-700 leading-relaxed">
            Features tested before delivery, continuous performance monitoring,
            user feedback surveys, immediate attention to delivery issues.
          </p>
        </section>

        <section id="customerResponsibilities" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Customer Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed">
            Maintain accurate account info, secure login credentials,
            comply with platform terms, ensure device/browser compatibility, and
            stable internet.
          </p>
        </section>

        <section id="deliveryIssues" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Delivery Issues and Resolution</h2>
          <p className="text-gray-700 leading-relaxed">
            Issues like email delays, login problems, payment confirmation delays
            addressed within specified response and resolution timelines.
          </p>
        </section>

        <section id="internationalDelivery" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">International Service Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            Services accessible worldwide, currency conversion applied, legal
            compliance with local data laws, English support only for
            international users.
          </p>
        </section>

        <section id="refunds" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Refund and Re-delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            Refunds processed in case of service non-activation, incomplete delivery,
            technical failure, or user error. Automatic retries every 30 minutes,
            support assistance within 2 hours.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <ul className="text-gray-700 mt-2 space-y-1">
            <li>Email: delivery@edusathi.net</li>
            <li>Phone: [Your Contact Number]</li>
            <li>WhatsApp: [Your WhatsApp Number]</li>
            <li>Support Hours: 9:00 AM - 9:00 PM IST (Mon-Sat)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ShippingPolicy;
