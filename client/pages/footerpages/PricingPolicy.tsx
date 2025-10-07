import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const PricingPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white mt-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Policy</h1>
        <h2 className="text-xl text-gray-700 mb-1">EduSathi - Multi-Branch Educational Platform</h2>
        <p className="text-sm text-gray-500">Version Updated: October 2025</p>
      </div>

      <div className="space-y-6 text-gray-800 leading-relaxed">
        <p>
          This Pricing Policy outlines the cost structure, payment terms, and billing guidelines for all services offered on the EduSathi platform. Our transparent pricing ensures fair access to educational technology across businesses, creators, and students.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Business Plans</h3>
        
        <p>
          <strong>Free Trial Plan:</strong> We offer a comprehensive 30-day free trial at ₹0 cost. This includes complete LMS system access, basic website customization, support for up to 50 student registrations, 5GB storage space, email support, core learning management features, and a basic analytics dashboard. This trial allows businesses to explore our platform's capabilities without any financial commitment.
        </p>

        <p>
          <strong>Annual Business Plan:</strong> Our main business offering is priced at ₹7,500 (excluding GST) for 12 months. This comprehensive plan includes unlimited LMS system access, full website customization with domain mapping, unlimited student registrations, 100GB storage space, priority phone and email support, advanced analytics and reporting, white-label branding options, custom certificate generation, multi-branch management, API access for integrations, and a dedicated account manager. Annual plans must be paid in advance, GST will be added as per Indian tax regulations, and no refunds are available after 15 days of service activation.
        </p>

        <p>
          <strong>Volume Discounts:</strong> We offer attractive discounts for bulk licenses: 5+ licenses receive 10% discount, 20+ licenses get 20% discount, 50+ licenses enjoy 30% discount, and custom enterprise pricing is available for 100+ licenses.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Creator Revenue Structure</h3>

        <p>
          <strong>Revenue Sharing Model:</strong> Creators retain 70% of course sales revenue while EduSathi retains 30%. Video views generate ₹2 per 1,000 qualified views, MCQ test completions pay ₹5 per completed assessment, and subscription content follows a 60% creator share, 40% platform share model.
        </p>

        <p>
          <strong>Creator Account Types:</strong> Free creator accounts allow uploading up to 50 videos per month, unlimited MCQ test creation, basic analytics, and standard revenue sharing. Premium creator accounts cost ₹999/month and include unlimited video uploads, advanced analytics and insights, priority content review, enhanced discoverability, live streaming capabilities, and direct student messaging.
        </p>

        <p>
          <strong>Payment Schedule:</strong> Creators must reach a minimum payout threshold of ₹1,000. Monthly payments are processed between the 1st-7th of each month via bank transfer (NEFT/RTGS), and TDS is deducted as per Income Tax regulations.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Student Pricing</h3>

        <p>
          <strong>Free Access:</strong> Students can access basic course browsing, limited free content, community forum participation, and basic profile creation at no cost.
        </p>

        <p>
          <strong>Premium Student Subscription:</strong> Monthly plans are available at ₹499/month, while annual plans cost ₹4,999/year (₹416/month with 17% savings). Premium subscriptions include unlimited access to premium courses, downloadable notes and materials, advanced practice tests, progress tracking and analytics, certificate generation, priority support, mobile app access, and offline content download.
        </p>

        <p>
          <strong>Individual Course Purchases:</strong> Courses range from ₹299 to ₹2,999 each. Pricing depends on course duration and content depth, creator tier and expertise level, additional resources included, and certification availability.
        </p>

        <p>
          <strong>Student Discounts:</strong> Educational institution partnerships offer up to 40% discount, bulk student subscriptions (50+ students) receive 25% discount, and annual payment plans provide 17% savings on monthly rates.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Payment Methods and Terms</h3>

        <p>
          <strong>Accepted Payment Methods:</strong> We accept Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking from all major Indian banks, UPI (PhonePe, Paytm, Google Pay), Digital Wallets, and Bank transfers for institutional payments.
        </p>

        <p>
          <strong>Billing Cycle and Auto-Renewal:</strong> All subscriptions auto-renew unless cancelled 7 days before expiry. Failed payments result in a 7-day grace period, followed by service suspension. Reactivation is available within 30 days of suspension.
        </p>

        <p>
          <strong>GST and Tax Compliance:</strong> 18% GST is applicable on all paid services. Tax invoices are generated automatically with GST registration details provided. TDS compliance for creator payments follows Indian tax laws.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Enterprise and Custom Solutions</h3>

        <p>
          <strong>Enterprise Pricing:</strong> Custom pricing is available for organizations requiring more than 100 user licenses, advanced integration requirements, custom feature development, dedicated infrastructure, SLA commitments, or on-premise deployment options.
        </p>

        <p>
          <strong>Consultation Services:</strong> Platform setup and training costs ₹15,000-₹50,000, custom development charges ₹2,000-₹5,000 per day, data migration services are ₹99 per GB, and premium support packages range from ₹999-₹4,999 per month.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Refund and Cancellation Policy</h3>

        <p>
          <strong>Business Plan Refunds:</strong> Free trials have no charges and can be cancelled anytime. Annual plans offer 100% refund within 15 days and pro-rated refunds within 60 days. Setup and customization fees are non-refundable.
        </p>

        <p>
          <strong>Student Subscription Refunds:</strong> New subscribers enjoy a 7-day money-back guarantee. Pro-rated refunds are available for technical issues beyond our control. Individual course purchases cannot be refunded after 48 hours.
        </p>

        <p>
          <strong>Late Payment Policy:</strong> Late payments incur 2% monthly charges on overdue amounts. Service suspension occurs after 15 days of non-payment, and account termination follows after 60 days. Account restoration requires a ₹500 fee.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <p>
            <strong>Contact Information:</strong> For billing inquiries, contact billing@edusathi.net. Payment disputes should be sent to disputes@edusathi.net with a 48-hour response time.
          </p>
          
          <p className="mt-4 text-sm">
            <strong>Effective Date:</strong> October 6, 2025 | <strong>Last Updated:</strong> October 6, 2025
          </p>
          
          <p className="mt-2 text-sm">
            This Pricing Policy is subject to change with appropriate notice to users. All prices are subject to applicable taxes and fees. All pricing is in Indian Rupees unless otherwise specified. By using EduSathi services, you agree to the terms outlined in this Pricing Policy along with our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPolicy;
