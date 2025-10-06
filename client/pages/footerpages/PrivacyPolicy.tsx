// src/pages/PrivacyPolicy.tsx
import React, { useEffect, useState } from "react";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "dataCollection", title: "Data Collection" },
  { id: "dataUsage", title: "Data Usage" },
  { id: "cookies", title: "Cookies and Tracking" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "User Rights" },
  { id: "thirdParties", title: "Third-Party Sharing" },
  { id: "minors", title: "Minors' Privacy" },
  { id: "policyChanges", title: "Policy Changes" },
  { id: "contact", title: "Contact Information" },
];

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-8">Privacy Policy - EduSathi</h1>

        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            EduSathi is committed to protecting the privacy of its users and
            ensuring secure handling of personal data collected through our
            platform, mobile apps, and associated services.
          </p>
        </section>

        <section id="dataCollection" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect personal information including name, email, contact
            number, and usage data to provide our services effectively. Data
            may also include device information, IP address, and interaction
            logs.
          </p>
        </section>

        <section id="dataUsage" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
          <p className="text-gray-700 leading-relaxed">
            Collected data is used for account management, service
            personalization, analytics, communications, payment processing, and
            compliance with legal requirements.
          </p>
        </section>

        <section id="cookies" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            EduSathi uses cookies and similar technologies to enhance user
            experience, track usage patterns, and serve relevant content and
            advertisements.
          </p>
        </section>

        <section id="security" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry-standard technical, administrative, and
            physical safeguards to protect user data against unauthorized
            access, disclosure, or modification.
          </p>
        </section>

        <section id="rights" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">User Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            Users have the right to access, correct, delete, and port their
            personal data, and to withdraw consent where applicable under
            prevailing data protection laws.
          </p>
        </section>

        <section id="thirdParties" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Sharing</h2>
          <p className="text-gray-700 leading-relaxed">
            Personal data may be shared with service providers, partners, and
            legal authorities in accordance with applicable laws and for
            operational purposes.
          </p>
        </section>

        <section id="minors" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Minors' Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            We obtain verifiable parental consent for users under 18 and apply
            special safeguards to protect minor users' personal data.
          </p>
        </section>

        <section id="policyChanges" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Policy Changes</h2>
          <p className="text-gray-700 leading-relaxed">
            Updates to this Privacy Policy will be communicated via email or
            platform notifications. Users are encouraged to review changes
            periodically.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            For any privacy-related queries, contact our team at:
          </p>
          <ul className="text-gray-700 mt-2 space-y-1">
            <li>Email: privacy@edusathi.net</li>
            <li>Phone: [Your Contact Number]</li>
            <li>Support Hours: 9:00 AM - 9:00 PM IST (Mon-Sat)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
