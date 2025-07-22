import React from 'react'
import Link from 'next/link'
import { FiExternalLink } from 'react-icons/fi'

function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 text-gray-500 text-sm mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/terms-of-service" 
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <FiExternalLink className="mr-1" /> Terms of Service
            </Link>
            <Link 
              href="/privacy-policy" 
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <FiExternalLink className="mr-1" /> Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer