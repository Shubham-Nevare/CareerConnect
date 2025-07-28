"use client";
import { FiShield, FiUser, FiDatabase, FiLock, FiMail, FiExternalLink } from "react-icons/fi";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8">
          <div className="flex items-center">
            <FiShield className="h-8 w-8 text-white mr-4" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-blue-100">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect various types of information in connection with the services we provide, including:
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">Personal Information You Provide</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Contact details (name, email, phone number, address)</li>
                  <li>Professional information (resume, work history, education)</li>
                  <li>Account credentials (username and encrypted password)</li>
                  <li>Job preferences and application materials</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
                <h3 className="font-medium text-purple-800 mb-2">Information Collected Automatically</h3>
                <ul className="list-disc pl-5 space-y-1 text-purple-700">
                  <li>Usage data (pages visited, time spent, clicks)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="font-medium text-green-800 mb-2">Information From Third Parties</h3>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                  <li>Social media profiles (when you connect accounts)</li>
                  <li>Background check providers (for verified applicants)</li>
                  <li>Referral sources</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiDatabase className="mr-2 text-blue-500" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>To provide and maintain our services</li>
                <li>To match you with relevant job opportunities</li>
                <li>To communicate with you about your account and job applications</li>
                <li>To improve and personalize your experience</li>
                <li>To analyze usage and improve our services</li>
                <li>To prevent fraud and ensure security</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <h3 className="font-medium text-yellow-800 mb-2">With Employers</h3>
                <p className="text-yellow-700">
                  When you apply for a job, we share your application materials with the relevant employer.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <h3 className="font-medium text-red-800 mb-2">Service Providers</h3>
                <p className="text-red-700">
                  We may share information with third-party vendors who help us operate our services (e.g., hosting, analytics).
                </p>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
                <h3 className="font-medium text-indigo-800 mb-2">Legal Requirements</h3>
                <p className="text-indigo-700">
                  We may disclose information if required by law or in response to valid legal requests.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiLock className="mr-2 text-blue-500" />
                4. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and testing</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700">
                While we strive to protect your information, no security system is impenetrable and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Access and review your information</li>
                <li>Update or correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us using the information below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiMail className="mr-2 text-blue-500" />
                6. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-800">CareerConnect Privacy Team</p>
                <p className="text-gray-700">123 Privacy Lane, Suite 100</p>
                <p className="text-gray-700">Mumbai, India 401107</p>
                <p className="text-gray-700">Email: privacy@careerconnect.com</p>
                <p className="text-gray-700">Phone: +91 1234567890</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/terms-of-service" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <FiExternalLink className="mr-1" /> View our Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}