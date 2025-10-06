// src/pages/TermsAndConditions.tsx
import React, { useEffect, useState } from "react";

const sections = [
  { id: "agreement", title: "Agreement to Terms" },
  { id: "definitions", title: "Definitions & Interpretation" },
  { id: "platformServices", title: "Platform Overview & Services" },
  { id: "userAccounts", title: "User Accounts & Registration" },
  { id: "ageRequirements", title: "Age Requirements & Parental Consent" },
  { id: "businessUsers", title: "Business User Terms" },
  { id: "creators", title: "Creator Terms & Conditions" },
  { id: "students", title: "Student Terms & Conditions" },
  { id: "acceptableUse", title: "Acceptable Use Policy" },
  { id: "paymentTerms", title: "Payment Terms & Billing" },
  { id: "ipRights", title: "Intellectual Property Rights" },
  { id: "contentGuidelines", title: "Content Guidelines & User Conduct" },
  { id: "privacy", title: "Privacy & Data Protection" },
  { id: "serviceAvailability", title: "Service Availability & Technical Support" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "termination", title: "Termination & Account Closure" },
  { id: "governingLaw", title: "Governing Law & Dispute Resolution" },
  { id: "modifications", title: "Modifications to Terms" },
  { id: "contact", title: "Contact Information" },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("agreement");

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
        <h1 className="text-3xl font-bold mb-8">Terms & Conditions - EduSathi</h1>

        <section id="agreement" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms and Conditions constitute a legally binding agreement
            between you and EduSathi Technologies Private Limited, regarding
            access to the EduSathi platform.
          </p>
        </section>

        <section id="definitions" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Definitions & Interpretation</h2>
          <p className="text-gray-700 leading-relaxed">
            Definitions of "Platform", "Business Users", "Creators", "Students",
            "Content", and "Personal Data" as used in this agreement.
          </p>
        </section>

        <section id="platformServices" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Platform Overview & Services</h2>
          <p className="text-gray-700 leading-relaxed">
            EduSathi provides LMS access, custom websites, content management, 
            student engagement, analytics, certifications, and multi-branch 
            management services for business, creators, and students.
          </p>
        </section>

        <section id="userAccounts" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">User Accounts & Registration</h2>
          <p className="text-gray-700 leading-relaxed">
            Account creation, security, verification requirements, and user
            responsibilities for maintaining account confidentiality.
          </p>
        </section>

        <section id="ageRequirements" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Age Requirements & Parental Consent
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Minimum age for users, parental consent for minors, and educational
            institution account setup requirements.
          </p>
        </section>

        <section id="businessUsers" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Business User Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            Subscription plans, service delivery timelines, responsibilities,
            white-label website rules, and compliance obligations.
          </p>
        </section>

        <section id="creators" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Creator Terms & Conditions
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Content creation, revenue sharing, professional conduct, and
            educational integrity standards.
          </p>
        </section>

        <section id="students" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Student Terms & Conditions</h2>
          <p className="text-gray-700 leading-relaxed">
            Academic integrity, one account per student, content usage rights,
            progress tracking, and certificate issuance.
          </p>
        </section>

        <section id="acceptableUse" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Acceptable Use Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            Prohibited activities, content standards, enforcement actions, and
            reporting mechanisms for violations.
          </p>
        </section>

        <section id="paymentTerms" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Payment Terms & Billing</h2>
          <p className="text-gray-700 leading-relaxed">
            Pricing, accepted payment methods, GST compliance, auto-renewal,
            failed payment handling, and creator payment processing.
          </p>
        </section>

        <section id="ipRights" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            Platform ownership, user content rights, copyright protections, and
            DMCA procedures.
          </p>
        </section>

        <section id="contentGuidelines" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Content Guidelines & User Conduct
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Educational content standards, community guidelines, and moderation
            policies.
          </p>
        </section>

        <section id="privacy" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Privacy & Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            Compliance with Digital Personal Data Protection Act 2023, student
            data security, parental consent, and user data rights.
          </p>
        </section>

        <section id="serviceAvailability" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Service Availability & Technical Support
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Uptime commitments, maintenance, emergency response, technical support
            types, and service limitations.
          </p>
        </section>

        <section id="liability" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Liability limits, educational outcomes disclaimer, and third-party
            services disclaimers.
          </p>
        </section>

        <section id="termination" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Termination & Account Closure
          </h2>
          <p className="text-gray-700 leading-relaxed">
            User-initiated and platform-initiated termination, data retention,
            and financial record policies.
          </p>
        </section>

        <section id="governingLaw" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Governing Law & Dispute Resolution
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Laws of India, exclusive jurisdiction of New Delhi courts, and
            mediation/arbitration procedures.
          </p>
        </section>

        <section id="modifications" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Modifications to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            Amendment procedures, advance notice, acceptance of changes, and
            user rights to terminate if disagreeing.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <ul className="text-gray-700 mt-2 space-y-1">
            <li>Email: legal@edusathi.net</li>
            <li>Address: EduSathi Technologies Private Limited, Kolkata Branch</li>
            <li>Customer Support: support@edusathi.net</li>
            <li>Support Hours: 9:00 AM - 9:00 PM IST (Mon-Sat)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default TermsAndConditions;
