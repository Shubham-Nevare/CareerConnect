"use client";
import { FiShield, FiSettings, FiAlertCircle } from "react-icons/fi";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8">
          <div className="flex items-center">
            <FiShield className="h-8 w-8 text-white mr-4" />
            <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="mt-2 text-blue-100">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="px-6 py-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiSettings className="mr-2 text-blue-500" />
                What Are Cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                As is common practice with almost all professional websites, this site uses cookies, which are tiny files
                that are downloaded to your computer, to improve your experience. This page describes what information
                they gather, how we use it, and why we sometimes need to store these cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiAlertCircle className="mr-2 text-blue-500" />
                How We Use Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases there are no industry
                standard options for disabling cookies without completely disabling the functionality and features they
                add to this site.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">Essential Cookies</h3>
                <p className="text-blue-700">
                  These cookies are strictly necessary to provide you with services available through our website and to
                  use some of its features, such as access to secure areas.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <h3 className="font-medium text-yellow-800 mb-2">Performance Cookies</h3>
                <p className="text-yellow-700">
                  These cookies collect information about how visitors use our website, for instance which pages visitors
                  go to most often. These cookies don't collect information that identifies a visitor.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                <h3 className="font-medium text-purple-800 mb-2">Functionality Cookies</h3>
                <p className="text-purple-700">
                  These cookies allow our website to remember choices you make and provide enhanced, more personal
                  features. They may be set by us or by third party providers whose services we have added to our pages.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disabling Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help
                for how to do this). Be aware that disabling cookies will affect the functionality of this and many other
                websites that you visit.
              </p>
              <p className="text-gray-700">
                Disabling cookies will usually result in also disabling certain functionality and features of this site.
                Therefore it is recommended that you do not disable cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                In some special cases we also use cookies provided by trusted third parties. The following section
                details which third party cookies you might encounter through this site.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Google Analytics</strong> - We use Google Analytics to understand how our site is being used in
                  order to improve the user experience. Google Analytics cookies may track things such as how long you
                  spend on the site and the pages that you visit.
                </li>
                <li>
                  <strong>Third Party APIs</strong> - We may use third party services that set cookies to enable their
                  functionality, such as embedded videos or social media sharing buttons.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">More Information</h2>
              <p className="text-gray-700">
                If you are looking for more information then you can contact us through one of our preferred contact
                methods:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>Email: privacy@careerconnect.com</li>
                <li>Phone: +91 1234567890</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}