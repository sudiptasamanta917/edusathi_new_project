import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const CancellationRefundPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="policy-container max-w-4xl mx-auto p-6 bg-white mt-20">
      <div className="policy-header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cancellation and Refund Policy</h1>
        <h2 className="text-xl text-gray-600 mb-2">EduSathi - Multi-Branch Educational Platform</h2>
        <p className="text-sm text-gray-500">Version Updated: October 2025</p>
      </div>

      <div className="policy-content space-y-8">
        {/* Overview Section */}
        <section className="overview">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            This Cancellation and Refund Policy outlines the terms and conditions governing cancellations, 
            refunds, and service termination for all EduSathi services. We are committed to fair and 
            transparent refund practices in compliance with the Consumer Protection Act, 2019, and 
            Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </section>

        {/* Legal Framework */}
        <section className="legal-framework">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Legal Framework and Consumer Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            As an educational technology platform, EduSathi recognizes that our users are "consumers" 
            under Indian law and educational services fall under the definition of "services" covered 
            by consumer protection legislation. Students, creators, and business users have specific 
            rights regarding refunds and cancellations.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Consumer Rights</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Right to be protected against unfair trade practices</li>
            <li>Right to seek redressal through Consumer Disputes Redressal Commissions</li>
            <li>Right to refund for defective or misrepresented services</li>
            <li>Right to transparent refund policy disclosure</li>
          </ul>
        </section>

        {/* Business Plan Section */}
        <section className="business-plans">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Business Plan Cancellation and Refunds</h2>
          
          <div className="free-trial mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Free Trial Plan</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Cancellation:</strong> Can be cancelled at any time during the 30-day trial period without any charges or obligations.</li>
              <li><strong>Refund:</strong> No refund applicable as the service is provided free of cost.</li>
              <li><strong>Data Retention:</strong> Account data will be preserved for 90 days after trial expiry for potential upgrade.</li>
            </ul>
          </div>

          <div className="annual-plan mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Annual Business Plan (₹7,500)</h3>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Refund Timeline and Rates</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Within 15 days of service activation: 100% refund of subscription fee</li>
              <li>16-30 days from service activation: 90% refund of subscription fee</li>
              <li>31-60 days from service activation: 75% refund of subscription fee</li>
              <li>61-90 days from service activation: 50% refund of subscription fee</li>
              <li>After 90 days: No refund available</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Non-Refundable Components</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Setup and customization fees (maximum ₹5,000 as per UGC guidelines)</li>
              <li>Domain registration costs paid to third parties</li>
              <li>SMS and email service charges already consumed</li>
              <li>Third-party integration costs</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Refund Processing</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Refund requests must be submitted through the official cancellation form</li>
              <li>Processing time: 15-30 business days from approval</li>
              <li>Refunds processed to original payment method</li>
              <li>GST amount adjusted as per tax regulations</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Business Account Cancellation Process</h4>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Submit cancellation request via email to billing@edusathi.net</li>
              <li>Provide reason for cancellation and feedback</li>
              <li>Complete data export if required (available for 30 days)</li>
              <li>Receive confirmation and refund timeline</li>
              <li>Account deactivation after data retention period</li>
            </ol>
          </div>
        </section>

        {/* Creator Account Section */}
        <section className="creator-accounts">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Creator Account Cancellation and Revenue</h2>
          
          <div className="free-creator mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Free Creator Account</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Cancellation:</strong> Immediate cancellation available at any time</li>
              <li><strong>Pending Earnings:</strong> All verified earnings paid within 30 days of account closure</li>
              <li><strong>Content Removal:</strong> Creator content removed within 7 days of account closure</li>
            </ul>
          </div>

          <div className="premium-creator mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Creator Account (₹999/month)</h3>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Monthly Subscription Refund Policy:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Within 7 days of subscription: 100% refund</li>
              <li>8-15 days of subscription: 50% refund</li>
              <li>After 15 days: No refund for current month</li>
              <li>Auto-renewal: Can be disabled at any time before next billing cycle</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Revenue Settlement Upon Cancellation</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Earned Revenue: All verified earnings above ₹1,000 threshold paid within 30 days</li>
              <li>Pending Verification: Revenue under verification reviewed within 15 days</li>
              <li>Refund Reversals: Course refunds may result in commission reversals</li>
              <li>Tax Compliance: TDS certificates provided for all payments made</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Creator Content Rights Post-Cancellation</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Creators retain ownership of original content</li>
              <li>EduSathi maintains limited license for existing student access until course completion</li>
              <li>New enrollments discontinued immediately upon cancellation</li>
              <li>Content can be removed upon explicit request</li>
            </ul>
          </div>
        </section>

        {/* Student Section */}
        <section className="student-refunds">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Subscription and Course Refunds</h2>
          
          <div className="subscription-refunds mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Student Subscription Refunds</h3>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Premium Monthly Subscription (₹499/month)</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Within 7 days of subscription: 100% refund (money-back guarantee)</li>
              <li>8-15 days: 50% refund for unused portion</li>
              <li>After 15 days: No refund for current month</li>
              <li>Next billing cycle: Can be cancelled to prevent auto-renewal</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Premium Annual Subscription (₹4,999/year)</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Within 15 days: 100% refund</li>
              <li>16-30 days: 90% refund</li>
              <li>31-90 days: 75% refund</li>
              <li>91-180 days: 50% refund</li>
              <li>After 180 days: No refund available</li>
            </ul>
          </div>

          <div className="course-refunds mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Individual Course Purchase Refunds</h3>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Course Refund Eligibility Criteria</h4>
            <p className="text-gray-700 mb-2">Students are eligible for course refunds if they meet ALL of the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Request submitted within 45 days of course purchase</li>
              <li>Completed less than 25% of course content</li>
              <li>No certificates downloaded or issued</li>
              <li>No assessment submissions made</li>
              <li>Genuine participation in available content</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 mb-3">Course Refund Timeline</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Within 7 days: 100% refund (no questions asked)</li>
              <li>8-30 days: 75% refund (subject to usage criteria)</li>
              <li>31-45 days: 50% refund (subject to usage criteria)</li>
              <li>After 45 days: No refunds available</li>
            </ul>
          </div>

          <div className="exceptional-refunds mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Exceptional Refund Circumstances</h3>
            <p className="text-gray-700 mb-2">Full refunds may be provided regardless of timeline for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Technical issues preventing course access for more than 72 hours</li>
              <li>Misrepresentation of course content or instructor qualifications</li>
              <li>Course cancellation by creator or platform</li>
              <li>Medical emergencies (with supporting documentation)</li>
              <li>Bereavement in immediate family (with supporting documentation)</li>
            </ul>
          </div>
        </section>

        {/* Special Refund Conditions */}
        <section className="special-conditions">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Special Refund Conditions</h2>
          
          <div className="service-deficiency mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Deficiency and Technical Issues</h3>
            <p className="text-gray-700 mb-2">Mandatory refunds apply when:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Platform services are unavailable for more than 24 hours continuously</li>
              <li>Promised features are not delivered within committed timelines</li>
              <li>Content quality falls significantly below advertised standards</li>
              <li>Data loss occurs due to platform technical failures</li>
            </ul>
          </div>

          <div className="misrepresentation mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Misrepresentation and Unfair Practices</h3>
            <p className="text-gray-700 mb-2">Full refunds provided for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>False advertising of course content or outcomes</li>
              <li>Instructor qualifications misrepresented</li>
              <li>Hidden fees or charges not disclosed during purchase</li>
              <li>Service features materially different from description</li>
            </ul>
          </div>

          <div className="force-majeure mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Force Majeure Situations</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Natural disasters affecting service delivery</li>
              <li>Government regulations restricting operations</li>
              <li>Technical infrastructure failures beyond our control</li>
              <li>Pandemic-related service disruptions</li>
            </ul>
          </div>
        </section>

        {/* Refund Process */}
        <section className="refund-process">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Process and Procedures</h2>
          
          <div className="request-submission mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Request Submission</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li><strong>Online Form:</strong> Submit request through edusathi.net/refund-request</li>
              <li><strong>Email Request:</strong> Send detailed request to refunds@edusathi.net</li>
              <li><strong>Required Information:</strong> Order ID, purchase date, reason for refund</li>
              <li><strong>Supporting Documents:</strong> If applicable (medical certificates, etc.)</li>
            </ol>
          </div>

          <div className="processing-timeline mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Processing Timeline</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Request Acknowledgment: Within 24 hours</li>
              <li>Review and Decision: 5-7 business days</li>
              <li>Processing and Payment: 15-30 business days</li>
              <li>International Payments: Additional 5-10 days for currency conversion</li>
            </ul>
          </div>

          <div className="refund-methods mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Methods</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Preferred Method: Original payment method (credit card, UPI, net banking)</li>
              <li>Bank Transfer: For cases where original method unavailable</li>
              <li>Processing Charges: Up to 3% may be deducted for payment gateway fees</li>
              <li>Currency: Refunds processed in Indian Rupees unless original payment in foreign currency</li>
            </ul>
          </div>
        </section>

        {/* Cancellation Charges */}
        <section className="cancellation-charges">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cancellation Charges and Penalties</h2>
          
          <div className="no-charges mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Cancellation Charges Policy</h3>
            <p className="text-gray-700 mb-2">In compliance with Consumer Protection (E-Commerce) Rules, 2020, EduSathi does not charge cancellation fees for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Subscription cancellations before service delivery</li>
              <li>Course cancellations within cooling-off period</li>
              <li>Service termination due to technical issues</li>
              <li>Cancellations due to misrepresentation</li>
            </ul>
          </div>

          <div className="late-cancellation mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Late Cancellation Considerations</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Business plans: Setup costs may be non-refundable after customization begins</li>
              <li>Creator accounts: Content processing costs may apply for premium features</li>
              <li>Student courses: Assessment and certificate costs deducted after generation</li>
            </ul>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="dispute-resolution">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dispute Resolution Process</h2>
          
          <div className="internal-resolution mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Internal Resolution</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Customer Support: First level resolution within 48 hours</li>
              <li>Escalation: Supervisor review within 7 days</li>
              <li>Management Review: Final internal review within 15 days</li>
              <li>Documentation: All communications recorded for transparency</li>
            </ul>
          </div>

          <div className="external-resolution mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">External Resolution Options</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>National Consumer Helpline: 1915 (toll-free)</li>
              <li>Consumer Disputes Redressal Commission: District, State, and National levels</li>
              <li>Ombudsman Services: Where applicable for financial disputes</li>
              <li>Legal Action: Through appropriate consumer forums</li>
            </ul>
          </div>
        </section>

        {/* Contact Information */}
        <section className="contact-info">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information and Support</h2>
          
          <div className="support-team mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Refund Support Team</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Primary Contact: refunds@edusathi.net</li>
              <li>Phone Support: [Your Contact Number] (9 AM - 6 PM IST)</li>
              <li>WhatsApp: [Your WhatsApp Number] (Text only)</li>
              <li>Response Time: 24-48 hours for initial response</li>
            </ul>
          </div>

          <div className="escalation-contacts mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Escalation Contacts</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Grievance Officer: grievance@edusathi.net</li>
              <li>Legal Compliance: legal@edusathi.net</li>
              <li>Customer Relations: support@edusathi.net</li>
            </ul>
          </div>

          <div className="emergency-situations mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Emergency Situations</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>24/7 Hotline: [Emergency Contact] (Technical issues affecting refunds)</li>
              <li>Priority Email: urgent@edusathi.net (Time-sensitive refund matters)</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <section className="policy-footer bg-gray-50 p-6 rounded-lg mt-8">
          <div className="effective-date mb-4">
            <p className="text-sm text-gray-600">
              <strong>Effective Date:</strong> October 6, 2025<br />
              <strong>Last Updated:</strong> October 6, 2025<br />
              <strong>Policy Version:</strong> 2.0
            </p>
          </div>
          
          <div className="important-notice mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              This Cancellation and Refund Policy is governed by Indian law and is designed to comply 
              with all applicable consumer protection regulations. For specific queries about your refund 
              eligibility, please contact our support team with your account details and purchase information.
            </p>
          </div>
          
          <div className="final-notice">
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              <strong>Important Notice:</strong> This policy should be read in conjunction with our Terms 
              and Conditions and Privacy Policy. In case of any conflict between documents, this Refund 
              Policy takes precedence for matters related to cancellations and refunds.
            </p>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Consumer Advisory:</strong> As per the Department of Consumer Affairs guidelines, 
              students and consumers should be aware of their rights and report unfair practices through 
              appropriate channels.
            </p>
          </div>
        </section>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default CancellationRefundPolicy;
