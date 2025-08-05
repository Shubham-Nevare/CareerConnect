"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiLoader } from "react-icons/fi";
import { FaLinkedin, FaGoogle, FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    companyName: "",
    newCompanyName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchCompanies = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      let companyId = null;
      let userId = null;
      let userPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      if (form.role === "recruiter") {
        if (!showNewCompany && form.companyName) {
          companyId = form.companyName;
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userPayload),
            }
          );
          const userData = await userRes.json();
          if (!userRes.ok)
            throw new Error(userData.error || "Registration failed");
          userId = userData.user.id || userData.user._id;
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ $addToSet: { recruiters: userId } }),
            }
          );
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company: companyId }),
          });
          login(userData.user, userData.token);
          setSuccess("Registration successful! Redirecting...");
          setTimeout(() => {
            router.push("/recruiter-dashboard");
          }, 1000);
          setLoading(false);
          return;
        } else {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userPayload),
            }
          );
          const userData = await userRes.json();
          if (!userRes.ok)
            throw new Error(userData.error || "Registration failed");
          userId = userData.user.id || userData.user._id;
          const companyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/companies`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: form.newCompanyName,
                recruiters: [userId],
              }),
            }
          );
          const companyData = await companyRes.json();
          if (!companyRes.ok)
            throw new Error(companyData.error || "Company creation failed");
          companyId = companyData._id;
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company: companyId }),
          });
          login(userData.user, userData.token);
          setSuccess("Registration successful! Redirecting...");
          setTimeout(() => {
            router.push("/recruiter-dashboard");
          }, 1000);
          setLoading(false);
          return;
        }
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...userPayload,
            ...(companyId ? { company: companyId } : {}),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      login(data.user, data.token);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push(
          form.role === "recruiter" ? "/recruiter-dashboard" : "/dashboard"
        );
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
     <motion.div 
      initial={{ opacity: 0 }}
      animate={isMounted ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white flex mt-4"
    >
      {/* Left Side - Illustration */}
      {isMounted && (
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex w-1/2 justify-center p-12"
        >
          <div className="w-full max-w-md text-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-blue-600">CareerConnect</h1>
              <p className="mt-4 text-xl text-gray-600">
                Join our community of professionals
              </p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative w-full aspect-[4/3]"
            >
              <Image
                src="/signup-page-img2.jpg"
                alt="Career illustration"
                fill
                className="object-cover rounded-lg"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,...[your base64 placeholder]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isMounted ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 mt-4">
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-blue-600"
            >
              CareerConnect
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-gray-600"
            >
              Create your account
            </motion.p>
          </div>

          {/* Registration Card */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                Create your account
              </motion.h2>

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
                          <p className="text-sm text-red-700">{error}</p>
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md transition duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
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
                  transition={{ delay: 0.7 }}
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
                      autoComplete="new-password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-3 border-gray-300 rounded-md transition duration-200"
                      placeholder="••••••••"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
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
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    I am a
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-md appearance-none transition duration-200"
                    >
                      <option value="jobseeker">Job Seeker</option>
                      <option value="recruiter">Recruiter/HR</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {form.role === "recruiter" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <select
                          name="companyName"
                          value={form.companyName}
                          onChange={(e) => {
                            handleChange(e);
                            setShowNewCompany(e.target.value === "__other__");
                          }}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-3 border-gray-300 rounded-md transition duration-200"
                          required
                        >
                          <option value="">Select a company</option>
                          {companies.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                          <option value="__other__">Other (Add new company)</option>
                        </select>
                        {showNewCompany && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-2"
                          >
                            <input
                              name="newCompanyName"
                              type="text"
                              required
                              value={form.newCompanyName || ""}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  newCompanyName: e.target.value,
                                }))
                              }
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-3 border-gray-300 rounded-md transition duration-200"
                              placeholder="Your Company Name"
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start"
                >
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{" "}
                      <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-500 transition duration-200">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500 transition duration-200">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin mr-2 h-4 w-4" />
                        Registering...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Social Registration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: <FaGoogle className="h-5 w-5 text-red-600" /> },
                    { icon: <FaLinkedin className="h-5 w-5 text-blue-700" /> },
                    { icon: <FaGithub className="h-5 w-5 text-gray-800" /> },
                  ].map((social, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
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
              transition={{ delay: 1.4 }}
              className="bg-gray-50 px-8 py-6"
            >
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                  Sign in
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}