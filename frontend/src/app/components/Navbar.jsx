"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Role-based dashboard link
  let dashboardLink = null;
  let profileLink = null;
  if (user) {
    if (user.role === "jobseeker") {
      dashboardLink = { href: "/dashboard", label: "Dashboard" };
      profileLink = { href: "/profile", label: "Profile" };
    }
    if (user.role === "recruiter") {
      dashboardLink = { href: "/recruiter-dashboard", label: "HR Dashboard" };
      profileLink = { href: "/recruiter-profile", label: "HR Profile" };
    }
    if (user.role === "admin") {
      dashboardLink = { href: "/admin-dashboard", label: "Admin Dashboard" };
      profileLink = { href: "/admin-profile", label: "Admin Profile" };
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: "100%", 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const menuItemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 300
      }
    })
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-screen mx-auto px-14 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            CareerConnect
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div 
          className="hidden md:flex gap-4 items-center"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className={`px-3 py-1 rounded transition ${
                pathname === "/"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Home
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/jobs"
              className={`px-3 py-1 rounded transition ${
                pathname === "/jobs"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Jobs
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/about"
              className={`px-3 py-1 rounded transition ${
                pathname === "/about"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              About
            </Link>
          </motion.div>

          {!user && (
            <>
              <motion.div variants={itemVariants}>
                <Link
                  href="/login"
                  className={`px-3 py-1 rounded transition ${
                    pathname === "/login"
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Login
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link
                  href="/register"
                  className={`px-3 py-1 rounded transition ${
                    pathname === "/register"
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}

          {user && (
            <motion.div className="relative" variants={itemVariants}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 px-3 py-1 rounded focus:outline-none group"
              >
                {user.profilePhoto ? (
                  <motion.img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePhoto}`}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all"
                    whileHover={{ scale: 1.05 }}
                  />
                ) : (
                  <motion.span 
                    className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold border-2 border-transparent group-hover:border-blue-500 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </motion.span>
                )}
                <span className="font-medium text-blue-700">
                  {user.name || "User"}
                </span>
                <motion.span
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <Link
                      href={profileLink ? profileLink.href : "/profile"}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {profileLink ? profileLink.label : "Profile"}
                    </Link>
                    <Link
                      href={dashboardLink ? dashboardLink.href : "/dashboard"}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {dashboardLink ? dashboardLink.label : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile Hamburger Button */}
        <motion.button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          whileTap={{ scale: 0.9 }}
        >
          <span className={`block h-1 w-6 bg-blue-600 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : "mb-1.5"}`}></span>
          <span className={`block h-1 w-6 bg-blue-600 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : "mb-1.5"}`}></span>
          <span className={`block h-1 w-6 bg-blue-600 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
        </motion.button>

        {/* Mobile Menu - Slides in from right */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <motion.div
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col p-6"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={mobileMenuVariants}
              >
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <motion.div className="flex flex-col space-y-4">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/jobs", label: "Jobs" },
                    { href: "/about", label: "About" },
                    user && dashboardLink,
                    user && profileLink,
                    !user && { href: "/login", label: "Login" },
                    !user && { href: "/register", label: "Register" },
                  ].filter(Boolean).map((item, i) => (
                    <motion.div
                      key={item.href}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                    >
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg transition ${
                          pathname === item.href
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {user && (
                    <motion.div
                      custom={6}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                    >
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </motion.div>

                {user && (
                  <motion.div 
                    className="mt-auto pt-6 border-t border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-3">
                      {user.profilePhoto ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePhoto}`}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{user.name || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}