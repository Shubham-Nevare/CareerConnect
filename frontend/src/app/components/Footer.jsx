"use client"
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
import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

function Footer() {
  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="w-full bg-gray-50 border-t border-gray-200 text-gray-600"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 py-12">
          {/* Company Info - Always on top for mobile */}
          <motion.div variants={itemVariants} className="order-1 lg:order-none space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">CareerConnect</h3>
            <p className="text-sm leading-relaxed">
              Connecting top talent with world-class companies. Find your dream job or ideal candidate with us.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <FiFacebook className="h-5 w-5" />, color: "hover:text-blue-600" },
                { icon: <FiTwitter className="h-5 w-5" />, color: "hover:text-blue-400" },
                { icon: <FiLinkedin className="h-5 w-5" />, color: "hover:text-blue-700" },
                { icon: <FiInstagram className="h-5 w-5" />, color: "hover:text-pink-600" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ y: -3 }}
                  href="#"
                  className={`text-gray-400 transition-colors ${social.color}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links and Resources - Side by side on mobile */}
          <div className="order-3 lg:order-none grid grid-cols-2 gap-6 lg:col-span-2 lg:grid-cols-2">
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { href: "/jobs", text: "Browse Jobs" },
                  { href: "/companies", text: "Companies" },
                  { href: "/career-advice", text: "Career Advice" },
                                    { href: "/interview-tips", text: "Interview Tips" },

                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link href={link.href} className="hover:text-blue-600 transition-colors flex items-center">
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              <ul className="space-y-3">
                {[
                  { 
                    href: "https://www.resume-now.com/lp/rnarsmsm121?utm_source=google&utm_medium=sem&utm_campaign=20457377013&utm_term=resume%20builder&network=g&device=c&adposition=&adgroupid=152901557416&placement=&adid=687406818899&gad_source=1&gad_campaignid=20457377013&gbraid=0AAAAADEP8E5hhUW8b2BVPkNzwdU-6cyYN&gclid=Cj0KCQjws4fEBhD-ARIsACC3d2-oNG9LdGefGfD_5IOw6dCv0ZNUEpvlLN-7nPmpwcIpCIKhhNchT8gaAkA4EALw_wcB", 
                    text: "Resume Builder" 
                  },
                  { 
                    href: "https://www.etmoney.com/tools-and-calculators/salary-calculator", 
                    text: "Salary Calculator" 
                  },
                  { 
                    href: "https://detailed.com/career-blogs/", 
                    text: "Career Blog" 
                  }
                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link 
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors flex items-center"
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info - Below Quick Links and Resources on mobile */}
          <motion.div variants={itemVariants} className="order-4 lg:order-none space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-3">
              {[
                { icon: <FiMail />, text: "careerconnectjobportal@gmail.com" },
                { icon: <FiPhone />, text: "+91 1234567890" },
                { icon: <FiMapPin />, text: "123 Career St, Mumbai, India 401107" }
              ].map((contact, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-start"
                >
                  <span className="mt-1 mr-3 flex-shrink-0 text-gray-500">
                    {contact.icon}
                  </span>
                  <span className="text-sm leading-tight">{contact.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-200 py-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-sm text-gray-500">
              &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { href: "/terms-of-service", text: "Terms of Service" },
                { href: "/privacy-policy", text: "Privacy Policy" },
                { href: "/cookie-policy", text: "Cookie Policy" },
                { href: "/contact-support", text: "Contact Support" },
                { href: "/gdpr-compliance", text: "GDPR Compliance" }
              ].map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;