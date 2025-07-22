"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

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
      dashboardLink = { href: "/recruiter-dashboard", label: "HR  Dashboard" };
      profileLink = { href: "/recruiter-profile", label: "HR Profile" };
    }
    if (user.role === "admin") {
      dashboardLink = { href: "/admin-dashboard", label: "Admin Dashboard" };
      profileLink = { href: "/admin-profile", label: "Admin Profile" };
    }
  }
// console.log(user.name);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-screen mx-auto px-14 py-3 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">CareerConnect</span>
        {/* Desktop links */}
        <div className="hidden md:flex gap-4 items-center">
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
          {!user && (
            <>
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
            </>
          )}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 px-3 py-1 rounded  focus:outline-none"
              >
                {user.profilePhoto ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePhoto}`}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
                <span className="font-medium text-blue-700">
                  {user.name || "User"}
                </span>
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
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
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
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block h-1 w-6 bg-blue-600 rounded transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : "mb-1"
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-blue-600 rounded transition-all duration-300 ${
              menuOpen ? "opacity-0" : "mb-1"
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-blue-600 rounded transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col items-center gap-2 py-2">
            <Link
              href="/"
              className={`w-full text-center px-3 py-2 rounded transition ${
                pathname === "/"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className={`w-full text-center px-3 py-2 rounded transition ${
                pathname === "/jobs"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Jobs
            </Link>
            {user && (
              <Link
                href={dashboardLink ? dashboardLink.href : "/dashboard"}
                className={`w-full text-center px-3 py-2 rounded transition ${
                  pathname ===
                  (dashboardLink ? dashboardLink.href : "/dashboard")
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {dashboardLink ? dashboardLink.label : "Dashboard"}
              </Link>
            )}
            {user && (
              <Link
                href={profileLink ? profileLink.href : "/profile"}
                className={`w-full text-center px-3 py-2 rounded transition ${
                  pathname === (profileLink ? profileLink.href : "/profile")
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {profileLink ? profileLink.label : "Profile"}
              </Link>
            )}
            {!user && (
              <>
                <Link
                  href="/login"
                  className={`w-full text-center px-3 py-2 rounded transition ${
                    pathname === "/login"
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`w-full text-center px-3 py-2 rounded transition ${
                    pathname === "/register"
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition mt-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
