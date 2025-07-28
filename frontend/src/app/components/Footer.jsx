import React from 'react';
import Link from 'next/link';
import { 
  FiExternalLink, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 text-gray-600 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">CareerConnect</h3>
            <p className="text-sm">
              Connecting top talent with world-class companies. Find your dream job or ideal candidate with us.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700">
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600">
                <FiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-blue-600 transition-colors">
                  Companies
                </Link>
              </li>
              {/* <li>
                <Link href="/recruiter-dashboard" className="hover:text-blue-600 transition-colors">
                  Post a Job
                </Link>
              </li> */}
              <li>
                <Link href="/career-advice" className="hover:text-blue-600 transition-colors">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                {/* <Link href="/resume-builder" className="hover:text-blue-600 transition-colors">
                  Resume Builder
                </Link> */}
                <Link href="https://www.resume-now.com/lp/rnarsmsm121?utm_source=google&utm_medium=sem&utm_campaign=20457377013&utm_term=resume%20builder&network=g&device=c&adposition=&adgroupid=152901557416&placement=&adid=687406818899&gad_source=1&gad_campaignid=20457377013&gbraid=0AAAAADEP8E5hhUW8b2BVPkNzwdU-6cyYN&gclid=Cj0KCQjws4fEBhD-ARIsACC3d2-oNG9LdGefGfD_5IOw6dCv0ZNUEpvlLN-7nPmpwcIpCIKhhNchT8gaAkA4EALw_wcB" className="hover:text-blue-600 transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/interview-tips" className="hover:text-blue-600 transition-colors">
                  Interview Tips
                </Link>
              </li>
              <li>
                {/* <Link href="/salary-calculator" className="hover:text-blue-600 transition-colors">
                  Salary Calculator
                </Link> */}
                <Link href="https://www.etmoney.com/tools-and-calculators/salary-calculator" className="hover:text-blue-600 transition-colors">
                  Salary Calculator
                </Link>
              </li>
              <li>
                {/* <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Career Blog
                </Link> */}
                <Link href="https://detailed.com/career-blogs/" className="hover:text-blue-600 transition-colors">
                  Career Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMail className="mt-1 mr-3 flex-shrink-0" />
                <span>careerconnectjobportal@gmail.com</span>
              </li>
              <li className="flex items-start">
                <FiPhone className="mt-1 mr-3 flex-shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-3 flex-shrink-0" />
                <span>123 Career St, Mumbai, India 401107</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-sm">
              &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link 
                href="/terms-of-service" 
                className="text-sm hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/privacy-policy" 
                className="text-sm hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/cookie-policy" 
                className="text-sm hover:text-blue-600 transition-colors"
              >
                Cookie Policy
              </Link>
               <Link 
                href="/contact-support" 
                className="text-sm hover:text-blue-600 transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/gdpr-compliance"   
                className="text-sm hover:text-blue-600 transition-colors"
              >
                GDPR Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;