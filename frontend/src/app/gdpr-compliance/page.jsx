"use client";
import { FiLock, FiDatabase, FiUserCheck, FiMail } from "react-icons/fi";

export default function GDPRCompliancePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8">
          <div className="flex items-center">
            <FiLock className="h-8 w-8 text-white mr-4" />
            <h1 className="text-3xl font-bold text-white">GDPR Compliance</h1>
          </div>
          <p className="mt-2 text-blue-100">
            General Data Protection Regulation (EU) 2016/679
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiDatabase className="mr-2 text-blue-500" />
                Our Commitment to GDPR
              </h2>
              <p className="text-gray-700 mb-4">
                CareerConnect is fully committed to complying with the General Data Protection Regulation (GDPR) (EU)
                2016/679. We have implemented robust policies and procedures to ensure that all personal data we process
                is handled in accordance with GDPR requirements.
              </p>
              <p className="text-gray-700">
                This page outlines our approach to data protection and the rights you have regarding your personal
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect and process personal data only when necessary for providing our services or when we have a
                legal basis to do so. The types of data we may collect include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Contact information (name, email address, phone number)</li>
                <li>Professional information (resume/CV, work history, education)</li>
                <li>Account credentials (username and encrypted password)</li>
                <li>Usage data (how you interact with our website)</li>
                <li>Technical data (IP address, browser type, device information)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiUserCheck className="mr-2 text-blue-500" />
                Your Rights Under GDPR
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Right to Access</h3>
                  <p className="text-blue-700">
                    You have the right to request copies of your personal data that we hold.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Right to Rectification</h3>
                  <p className="text-green-700">
                    You have the right to request correction of any inaccurate personal data.
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Right to Erasure</h3>
                  <p className="text-yellow-700">
                    You have the right to request deletion of your personal data under certain conditions.
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Right to Restrict Processing</h3>
                  <p className="text-purple-700">
                    You have the right to request restriction of processing your personal data.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-2">Right to Object</h3>
                  <p className="text-red-700">
                    You have the right to object to our processing of your personal data.
                  </p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-medium text-indigo-800 mb-2">Right to Data Portability</h3>
                  <p className="text-indigo-700">
                    You have the right to request transfer of your data to another organization.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to ensure a level of security appropriate
                to the risk, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and testing</li>
                <li>Access controls and authentication procedures</li>
                <li>Staff training on data protection</li>
                <li>Incident response plans</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain personal data only for as long as necessary to fulfill the purposes for which it was collected,
                including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              <p className="text-gray-700">
                When determining the appropriate retention period, we consider the amount, nature, and sensitivity of the
                personal data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we
                process your personal data, and applicable legal requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiMail className="mr-2 text-blue-500" />
                Contact Our Data Protection Officer
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this GDPR Compliance statement or our data protection practices, please
                contact our Data Protection Officer:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-800">Data Protection Officer</p>
                <p className="text-gray-700">CareerConnect Inc.</p>
                <p className="text-gray-700">123 Privacy Lane, Suite 100</p>
                <p className="text-gray-700">Mumbai, India 401107</p>
                <p className="text-gray-700">Email: dpo@careerconnect.com</p>
                <p className="text-gray-700">Phone: +91 1234567890</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Statement</h2>
              <p className="text-gray-700">
                We may update this GDPR Compliance statement from time to time. We will notify you of any changes by
                posting the new statement on this page and updating the "last updated" date at the top of this page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}