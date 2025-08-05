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
        ease: "easeInOut",
        duration: 0.2
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-blue-600"
        >
          CareerConnect
        </motion.div>

        {/* Desktop links */}
        <motion.div 
          initial="hidden"
          animate="visible"
          className="hidden md:flex gap-4 items-center"
        >
          {[
            { href: "/", label: "Home" },
            { href: "/jobs", label: "Jobs" },
            { href: "/about", label: "About" },
            ...(!user ? [
              { href: "/login", label: "Login" },
              { href: "/register", label: "Register" }
            ] : [])
          ].map((link, i) => (
            <motion.div key={link.href} custom={i} variants={navItem}>
              <Link
                href={link.href}
                className={`px-3 py-1 rounded transition ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}

          {user && (
            <motion.div custom={3} variants={navItem} className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 px-3 py-1 rounded focus:outline-none"
              >
                {user.profilePhoto ? (
                  <motion.img
                    src={`${user.profilePhoto}`}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                    whileHover={{ scale: 1.05 }}
                  />
                ) : (
                  <motion.span 
                    className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </motion.span>
                )}
                <span className="font-medium text-blue-700">
                  {user.name || "User"}
                </span>
                <motion.svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
                  >
                    <Link
                      href={profileLink ? profileLink.href : "/profile"}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      {profileLink ? profileLink.label : "Profile"}
                    </Link>
                    <Link
                      href={dashboardLink ? dashboardLink.href : "/dashboard"}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      {dashboardLink ? dashboardLink.label : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 "
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-50"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          whileTap={{ scale: 0.9 }}
        >
          <motion.span
            className={`block h-1 w-6 bg-blue-600 rounded-full ${
              menuOpen ? "absolute top-1/2" : "mb-1.5"
            }`}
            animate={{
              rotate: menuOpen ? 45 : 0,
              y: menuOpen ? 0 : 0,
              width: menuOpen ? "1.5rem" : "1.5rem"
            }}
          ></motion.span>
          <motion.span
            className={`block h-1 w-6 bg-blue-600 rounded-full mb-1.5`}
            animate={{
              opacity: menuOpen ? 0 : 1,
              width: menuOpen ? 0 : "1.5rem"
            }}
          ></motion.span>
          <motion.span
            className={`block h-1 w-6 bg-blue-600 rounded-full ${
              menuOpen ? "absolute top-1/2" : ""
            }`}
            animate={{
              rotate: menuOpen ? -45 : 0,
              y: menuOpen ? 0 : 0,
              width: menuOpen ? "1.5rem" : "1.5rem"
            }}
          ></motion.span>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-40"
          >
            <div className="h-full flex flex-col pt-20 pb-4 px-6 overflow-y-auto">
              <motion.div
                variants={fadeIn}
                className="flex flex-col gap-4"
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/jobs", label: "Jobs" },
                  { href: "/about", label: "About" },
                  ...(user ? [
                    { 
                      href: dashboardLink ? dashboardLink.href : "/dashboard", 
                      label: dashboardLink ? dashboardLink.label : "Dashboard" 
                    },
                    { 
                      href: profileLink ? profileLink.href : "/profile", 
                      label: profileLink ? profileLink.label : "Profile" 
                    }
                  ] : [])
                ].map((link, i) => (
                  <motion.div 
                    key={link.href}
                    custom={i}
                    variants={navItem}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                        pathname === link.href
                          ? "bg-blue-600 text-white"
                          : "text-blue-600 hover:bg-blue-100"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {!user && (
                  <>
                    <motion.div custom={3} variants={navItem} className="w-full">
                      <Link
                        href="/login"
                        className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                          pathname === "/login"
                            ? "bg-blue-600 text-white"
                            : "text-blue-600 hover:bg-blue-100"
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div custom={4} variants={navItem} className="w-full">
                      <Link
                        href="/register"
                        className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                          pathname === "/register"
                            ? "bg-blue-600 text-white"
                            : "text-blue-600 hover:bg-blue-100"
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </motion.div>
                  </>
                )}

                {user && (
                  <motion.div 
                    custom={5} 
                    variants={navItem}
                    className="w-full mt-4"
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-center px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}