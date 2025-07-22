import { FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect personal information you provide when creating an account, applying for jobs, or using our services. This may include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Contact information (name, email, phone)</li>
            <li>Professional information (resume, work history, education)</li>
            <li>Usage data and cookies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Provide and improve our services</li>
            <li>Match you with potential employers</li>
            <li>Communicate with you about opportunities</li>
            <li>Analyze usage patterns</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 mb-4">
            We may share your profile information with potential employers when you apply for jobs. We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your information. However, no internet transmission is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You may access, update, or delete your account information at any time through your profile settings.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/terms-of-service" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiExternalLink className="mr-1" /> View our Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}