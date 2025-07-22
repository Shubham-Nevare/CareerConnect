import { FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to our job portal. These Terms of Service govern your use of our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. User Accounts</h2>
          <p className="text-gray-700 mb-4">
            You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Job Listings</h2>
          <p className="text-gray-700 mb-4">
            We strive to provide accurate job listings but cannot guarantee the accuracy of all postings. Always verify details with employers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Conduct</h2>
          <p className="text-gray-700 mb-4">
            You agree not to use the service for any unlawful purpose or to submit false information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            We are not responsible for any employment decisions made by employers or any interactions between users.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/privacy-policy" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiExternalLink className="mr-1" /> View our Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}