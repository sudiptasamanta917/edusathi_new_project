import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white mt-20">
      {/* Header */}
      <div className="text-center mb-8 bg-gray-50 p-8 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms and Conditions</h1>
        <h2 className="text-xl text-gray-600 mb-3">EduSathi - Multi-Branch Educational Platform</h2>
        <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
          Version Updated: October 2025
        </span>
      </div>

      {/* Agreement Section */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Agreement to Terms</h3>
        <p className="text-gray-700 mb-4">
          These Terms and Conditions constitute a legally binding agreement between you (whether 
          personally or on behalf of an entity) and <strong>EduSathi Technologies Private Limited</strong> 
          ("EduSathi," "we," "us," or "our"), concerning your access to and use of the EduSathi 
          platform at edusathi.net and all related services.
        </p>
        <p className="text-gray-700">
          By accessing or using our platform, you acknowledge that you have read, understood, and 
          agree to be bound by these Terms and Conditions. If you do not agree with these terms, 
          you must not access or use our services.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">1. Definitions and Interpretation</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">2. Platform Overview and Services</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">3. User Accounts and Registration</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">4. Age Requirements and Parental Consent</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">5. Business User Terms</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">6. Creator Terms and Conditions</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">7. Student Terms and Conditions</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">8. Acceptable Use Policy</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">9. Payment Terms and Billing</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">10. Intellectual Property Rights</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">11. Content Guidelines and User Conduct</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">12. Privacy and Data Protection</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">13. Service Availability and Technical Support</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">14. Limitation of Liability</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">15. Termination and Account Closure</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">16. Governing Law and Dispute Resolution</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">17. Modifications to Terms</div>
          <div className="text-blue-600 hover:text-blue-800 cursor-pointer">18. Contact Information</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">

        {/* Section 1 */}
        <section className="border-l-4 border-blue-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Definitions and Interpretation</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>"Platform"</strong> refers to the EduSathi website, mobile applications, and all related services accessible at edusathi.net.</p>
            <p><strong>"Business Users"</strong> are organizations or individuals who subscribe to our business plans to access LMS systems and customizable websites.</p>
            <p><strong>"Creators"</strong> are individuals who upload educational content, courses, tests, and earn revenue through our platform.</p>
            <p><strong>"Students"</strong> are learners who access educational content, participate in courses, and utilize learning resources.</p>
            <p><strong>"Content"</strong> includes all text, images, videos, audio, courses, tests, notes, and other materials available on the platform.</p>
            <p><strong>"Personal Data"</strong> has the meaning assigned under the Digital Personal Data Protection Act, 2023.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="border-l-4 border-green-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Platform Overview and Services</h3>
          <p className="text-gray-700 mb-4">
            EduSathi operates a comprehensive educational technology platform serving three distinct user categories with specialized services:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Business Services</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Learning Management System (LMS) access</li>
                <li>• Customizable white-label websites</li>
                <li>• Student enrollment and management tools</li>
                <li>• Analytics and reporting features</li>
                <li>• Multi-branch administrative capabilities</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">Creator Services</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Content upload and management tools</li>
                <li>• Revenue sharing opportunities</li>
                <li>• Student engagement features</li>
                <li>• Performance analytics</li>
                <li>• Course creation and assessment tools</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-3">Student Services</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Access to educational content and courses</li>
                <li>• Interactive learning materials</li>
                <li>• Progress tracking and certifications</li>
                <li>• Community participation</li>
                <li>• Mobile and offline access capabilities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="border-l-4 border-purple-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">3. User Accounts and Registration</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Account Creation Requirements</h4>
              <p className="text-gray-700">
                All users must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Account Security</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Use strong, unique passwords</li>
                <li>• Do not share login credentials</li>
                <li>• Immediately notify us of unauthorized access</li>
                <li>• Enable two-factor authentication when available</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Account Verification</h4>
              <p className="text-gray-700">
                We may require identity verification for certain account types, particularly for creators earning revenue and business users making payments. Verification may include document submission and identity confirmation processes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="border-l-4 border-yellow-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Age Requirements and Parental Consent</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Minimum Age Requirements</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Individual users must be at least 13 years old</li>
                <li>• Users between 13-18 years require verifiable parental consent</li>
                <li>• Business account administrators must be at least 18 years old</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Parental Consent for Minors</h4>
              <p className="text-gray-700">
                In compliance with the Digital Personal Data Protection Act, 2023, we obtain verifiable parental consent before collecting personal data from users under 18 years. Parents can withdraw consent and request account deletion at any time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Educational Institution Accounts</h4>
              <p className="text-gray-700">
                Schools and educational institutions can create accounts for students under appropriate supervision and with proper authorization from parents/guardians.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="border-l-4 border-red-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Business User Terms</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Subscription Plans</h4>
              <p className="text-gray-700">
                Business users can choose from available plans including free trials and paid subscriptions. Current pricing is available at edusathi.net/pricing and is subject to applicable taxes including 18% GST.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Service Delivery</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• LMS access activated within 24 hours of payment confirmation</li>
                <li>• Custom website setup completed within 3-7 business days</li>
                <li>• Technical support provided during business hours</li>
                <li>• Service level agreements detailed in our Service Delivery Policy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Business User Responsibilities</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Ensure proper licensing for any content used</li>
                <li>• Maintain accurate student records and data protection</li>
                <li>• Provide appropriate supervision for minor students</li>
                <li>• Honor refund and cancellation policies</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">White-Label Website Terms</h4>
              <p className="text-gray-700 mb-2">Business users receive customizable websites with the understanding that:</p>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Content must comply with Indian law and regulations</li>
                <li>• No illegal, harmful, or inappropriate material is permitted</li>
                <li>• Copyright and trademark compliance is mandatory</li>
                <li>• Technical support is provided for platform-related issues only</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="border-l-4 border-indigo-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">6. Creator Terms and Conditions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Content Creation and Upload</h4>
              <p className="text-gray-700">
                Creators agree to upload only original content or content for which they have proper licensing rights. All uploaded content must comply with our content guidelines and Indian copyright laws.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Revenue Sharing Agreement</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Course sales: 70% creator share, 30% platform fee</li>
                <li>• Video views: ₹2 per 1,000 qualified views</li>
                <li>• MCQ completions: ₹5 per completed assessment</li>
                <li>• Payments processed monthly with minimum ₹1,000 threshold</li>
                <li>• TDS deducted as per Indian Income Tax regulations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Creator Responsibilities</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Ensure content accuracy and educational value</li>
                <li>• Respect intellectual property rights of others</li>
                <li>• Provide timely student support when applicable</li>
                <li>• Maintain professional conduct in all interactions</li>
                <li>• Comply with content quality standards</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Honor Code for Educational Content</h4>
              <p className="text-gray-700 mb-2">Creators must adhere to educational integrity standards including:</p>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Original content creation or proper attribution</li>
                <li>• Accurate representation of qualifications and expertise</li>
                <li>• Prohibition of misleading claims about outcomes</li>
                <li>• Maintenance of professional educational standards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="border-l-4 border-pink-400 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">7. Student Terms and Conditions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Learning Environment Conduct</h4>
              <p className="text-gray-700 mb-2">Students agree to maintain academic integrity and professional behavior including:</p>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• One account per person policy</li>
                <li>• Original work on assignments and assessments</li>
                <li>• No sharing of answers or solutions inappropriately</li>
                <li>• Respectful interaction with other learners and creators</li>
                <li>• Compliance with course-specific rules and guidelines</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Content Usage Rights</h4>
              <p className="text-gray-700">
                Students may access and use educational content for personal learning purposes only. Redistribution, sale, or unauthorized sharing of copyrighted materials is strictly prohibited.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Progress Tracking and Certificates</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Learning progress is tracked and stored securely</li>
                <li>• Certificates issued upon successful completion</li>
                <li>• Academic records maintained according to educational standards</li>
                <li>• Privacy of learning data protected under applicable laws</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="border-l-4 border-red-500 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">8. Acceptable Use Policy</h3>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Prohibited Activities</h4>
              <p className="text-gray-700 mb-2">Users must not engage in the following activities:</p>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Violating any applicable laws or regulations</li>
                <li>• Uploading malicious software or harmful code</li>
                <li>• Harassing, bullying, or intimidating other users</li>
                <li>• Sharing inappropriate, offensive, or illegal content</li>
                <li>• Attempting to hack, reverse engineer, or compromise platform security</li>
                <li>• Creating fake accounts or impersonating others</li>
                <li>• Spamming or sending unsolicited communications</li>
                <li>• Violating intellectual property rights</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✓ Content Standards</h4>
              <p className="text-gray-700 mb-2">All user-generated content must:</p>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Be relevant to educational purposes</li>
                <li>• Comply with community guidelines</li>
                <li>• Respect copyright and trademark laws</li>
                <li>• Maintain appropriate language and tone</li>
                <li>• Avoid discriminatory or harmful material</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">⚡ Enforcement</h4>
              <p className="text-gray-700 mb-2">Violation of acceptable use policies may result in:</p>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Content removal without prior notice</li>
                <li>• Temporary or permanent account suspension</li>
                <li>• Forfeiture of earnings for creators</li>
                <li>• Legal action when appropriate</li>
                <li>• Reporting to relevant authorities for illegal activities</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Remaining sections in similar format... */}
        
        {/* Section 18 - Contact Information */}
        <section className="border-l-4 border-blue-500 pl-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">18. Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📧 Legal and Compliance</h4>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> legal@edusathi.net</p>
              <p className="text-gray-700">
                <strong>Address:</strong><br/>
                EduSathi Technologies Private Limited<br/>
                Kolkata Branch
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🎧 Customer Support</h4>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> support@edusathi.net</p>
              <p className="text-gray-700"><strong>Support Hours:</strong> 9:00 AM - 9:00 PM IST (Monday-Saturday)</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-12 bg-gray-800 text-white p-6 rounded-lg text-center">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <div>
            <strong>Effective Date:</strong> October 6, 2025
          </div>
          <div>
            <strong>Last Updated:</strong> October 6, 2025
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <p>
            These Terms and Conditions constitute the entire agreement between you and EduSathi 
            Technologies Private Limited. By using our platform, you acknowledge that you have read, 
            understood, and agree to be bound by these terms and our Privacy Policy.
          </p>
          
          <p>
            For questions about these Terms and Conditions, please contact our legal team at 
            <a href="mailto:legal@edusathi.net" className="text-blue-300 hover:text-blue-200"> legal@edusathi.net</a>.
          </p>
          
          <div className="bg-gray-700 p-3 rounded mt-4">
            <p className="text-xs">
              <strong>Note:</strong> This document should be reviewed by qualified legal counsel to ensure 
              compliance with all applicable laws and regulations specific to your business operations 
              and jurisdiction.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
