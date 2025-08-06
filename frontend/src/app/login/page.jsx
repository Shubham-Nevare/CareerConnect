"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { FaLinkedin, FaGoogle, FaGithub } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.user?.status !== "active") {
        throw {
          custom: true,
          message: (
            <span>
              Your account is not active. Please{" "}
              <Link
                href="/contact-support"
                className="text-gray-700 hover:text-blue-600"
              >
                Contact Support
              </Link>
              .
            </span>
          ),
        };
      }
      login(data.user, data.token);
      setSuccess("Login successful! Redirecting...");
      let redirectPath = "/dashboard";
      if (data.user?.role === "recruiter")
        redirectPath = "/recruiter-dashboard";
      if (data.user?.role === "admin") redirectPath = "/admin-dashboard";
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      if (err.custom && err.message) {
        setError(err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <motion.div 
      initial={{ opacity: 0 }}
      animate={isMounted ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white flex flex-col lg:flex-row"
    >
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 order-2 lg:order-1">
        <motion.div
          initial={{ x: -50, opacity: 0 }} 
          animate={isMounted ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }} 
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:hidden text-center mb-6 mt-10"
          >
            <Link href="/" className="inline-block">
              <div className="text-3xl font-bold text-blue-600">
                CareerConnect
              </div>
            </Link>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ scale: 0.95, x: -20 }} 
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden lg:mt-6"
          >
            <div className="p-6 sm:p-8">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-red-500">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            {typeof error === "string" ? error : error}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-green-500">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{success}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                Sign in to your account
              </motion.h2>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md transition duration-200"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-3 border-gray-300 rounded-md transition duration-200"
                      placeholder="••••••••"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition duration-200"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 cursor-pointer ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin mr-2 h-4 w-4 " />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Social Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 ">
                  {[
                    { icon: <FaGoogle className="h-5 w-5 text-red-600" /> },
                    { icon: <FaLinkedin className="h-5 w-5 text-blue-700" /> },
                    { icon: <FaGithub className="h-5 w-5 text-gray-800" /> },
                  ].map((social, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200 cursor-pointer"
                      >
                        {social.icon}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer - Mobile only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6"
            >
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
     <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={isMounted ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }} 
        className="hidden lg:flex w-1/2 items-center justify-center p-8  order-1 lg:order-2"
      >
        <div className="w-full max-w-2xl text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-4"
          >
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold text-blue-600">
                CareerConnect
              </h1>
            </Link>
            <p className="mt-4 text-xl text-gray-600 mb-8">
              Find your dream job or top talent today
            </p>
          </motion.div>

           <motion.div
            initial={{ scale: 0.9, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="relative w-full aspect-[4/3]"
          >
            <Image
              src="/login-page-img.jpg"
              alt="Career illustration showing people connecting for jobs"
              fill
              className="object-contain rounded-xl"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,...[your base64 placeholder]"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}