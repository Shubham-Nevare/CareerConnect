"use client";
import { FiFileText, FiAlertTriangle, FiUser, FiBriefcase, FiSettings, FiExternalLink } from "react-icons/fi";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8">
          <div className="flex items-center">
            <FiFileText className="h-8 w-8 text-white mr-4" />
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="mt-2 text-blue-100">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using the CareerConnect job portal ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                2. User Accounts
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">Account Creation</h3>
                <p className="text-blue-700">
                  To use certain features, you must create an account. You agree to provide accurate, current, and complete information during registration.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h3 className="font-medium text-red-800 mb-2">Account Security</h3>
                <p className="text-red-700">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiBriefcase className="mr-2 text-blue-500" />
                3. Job Listings and Applications
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <h3 className="font-medium text-yellow-800 mb-2">Job Postings</h3>
                <p className="text-yellow-700">
                  We strive to provide accurate job listings but cannot guarantee the completeness or accuracy of all postings. You should verify all job details directly with employers.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="font-medium text-green-800 mb-2">Applications</h3>
                <p className="text-green-700">
                  When you apply for jobs through our Service, your application materials will be shared with the relevant employer. We are not responsible for employers' hiring decisions.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiAlertTriangle className="mr-2 text-blue-500" />
                4. Prohibited Conduct
              </h2>
              <p className="text-gray-700 mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Posting false or misleading information</li>
                <li>Impersonating any person or entity</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Using the Service for any illegal or unauthorized purpose</li>
                <li>Interfering with or disrupting the Service</li>
                <li>Attempting to gain unauthorized access to accounts or systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiSettings className="mr-2 text-blue-500" />
                5. Service Modifications
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by applicable law, CareerConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "last updated" date.
              </p>
              <p className="text-gray-700">
                Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-800">CareerConnect Support</p>
                <p className="text-gray-700">123 Business Avenue, Suite 200</p>
                <p className="text-gray-700">Mumbai, India 401107</p>
                <p className="text-gray-700">Email: legal@careerconnect.com</p>
                <p className="text-gray-700">Phone: +91 1234567890</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/privacy-policy" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <FiExternalLink className="mr-1" /> View our Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}