"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "./components/AuthProvider";
import { FiAward, FiBriefcase, FiClock, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [latestJobs, setLatestJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const router = require("next/navigation").useRouter();

  useEffect(() => {
    // Fetch jobs from API, filter active, sort by createdAt desc, take 4
    const fetchLatestJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs?status=active&limit=4&sort=-createdAt`
        );
        const data = await res.json();
        // console.log("Fetched jobs:", data);
        // If API doesn't support limit/sort, do it here:
        let jobs = Array.isArray(data) ? data : data.jobs || [];
        jobs = jobs.filter((job) => job.status === "active");
        jobs = jobs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestJobs(jobs.slice(0, 4));
      } catch (err) {
        setLatestJobs([]);
      }
    };
    fetchLatestJobs();
  }, []);
  // Refs for animation targets
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const jobsRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  //   const ctaRef = useRef(null);

  const { user } = useAuth();

  // Animation setup
  useEffect(() => {
    // Hero section animations
    gsap.from(heroRef.current.querySelectorAll(".hero-content > *"), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.3,
    });

    // Search bar animation
    gsap.from(searchRef.current, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      delay: 1,
    });

    // Stats counter animation
    const counters = statsRef.current.querySelectorAll(".count");
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 2;
      const step = target / (duration * 60);

      let current = 0;
      const updateCounter = () => {
        if (current < target) {
          current += step;
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      ScrollTrigger.create({
        trigger: counter,
        start: "top 80%",
        onEnter: updateCounter,
        once: true,
      });
    });
  }, []);

  // Handler for search
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("q", searchTerm);
    if (location) params.append("location", location);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-cover"></div>
        </div>

        <div ref={heroRef} className="max-w-6xl mx-auto relative z-10">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your <span className="text-yellow-300">Dream Job</span> Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Join thousands of companies and candidates connecting through our
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/jobs"
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Jobs
              </Link>
              {user && user.role === "recruiter" && (
                <Link
                  href="/recruiter-dashboard"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Post a Job
                </Link>
              )}
            </div>
          </div>

          <form
            ref={searchRef}
            className="relative max-w-2xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl p-1 shadow-xl border border-white/10"
            onSubmit={handleSearch}
          >
            <div className="flex flex-col md:flex-row gap-1">
              {/* Search Input */}
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 md:py-4 rounded-lg bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-white text-sm md:text-base transition-all"
                  placeholder="Job title, keywords, or company"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Location Select */}
              <div className="relative">
                <select
                  className="w-full px-4 py-3 md:py-4 bg-white/20 text-white border-0 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-lg appearance-none text-sm md:text-base"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="" className="bg-gray-800 text-white">
                    All Locations
                  </option>
                  <option value="remote" className="bg-gray-800 text-white">
                    Remote
                  </option>
                  <option value="mumbai" className="bg-gray-800 text-white">
                    Mumbai
                  </option>
                  <option value="pune" className="bg-gray-800 text-white">
                    Pune
                  </option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none"
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

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Trusted Companies */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-6">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            {["Google", "Microsoft", "Amazon", "Apple", "Netflix", "Tesla"].map(
              (company, i) => (
                <div key={i} className="text-2xl font-bold text-gray-700">
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Job Categories */}
      <section ref={categoriesRef} className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Popular Job Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse jobs by your preferred category. We have opportunities
              across all industries.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Technology", icon: "💻", jobs: 1243 },
              { name: "Healthcare", icon: "🏥", jobs: 892 },
              { name: "Finance", icon: "💰", jobs: 756 },
              { name: "Education", icon: "📚", jobs: 543 },
              { name: "Marketing", icon: "📢", jobs: 678 },
              { name: "Design", icon: "🎨", jobs: 432 },
              { name: "Engineering", icon: "⚙️", jobs: 987 },
              { name: "Remote", icon: "🌎", jobs: 1567 },
              { name: "Sales", icon: "📈", jobs: 765 },
              { name: "Customer Service", icon: "👥", jobs: 321 },
            ].map((category, i) => (
              <Link
                key={i}
                href={`/jobs?category=${category.name.toLowerCase()}`}
                className="category-card group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:translate-y-[-4px]"
              >
                <div className="text-3xl mb-3 group-hover:text-blue-600 transition">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {category.jobs.toLocaleString()} jobs
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section ref={jobsRef} className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold">Featured Jobs</h2>
              <p className="text-gray-600">
                Hand-picked opportunities from top companies
              </p>
            </div>
            <Link
              href="/jobs"
              className="flex items-center text-blue-600 font-medium hover:underline"
            >
              View all jobs <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {latestJobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No active jobs found.
              </div>
            ) : (
              latestJobs.map((job) => (
                <div
                  key={job._id || job.id}
                  className="job-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 md:w-[850px] justify-self-center	"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        {job.company?.logo ? (
                          <img
                            src={`${job.company.logo}`}
                            alt={job.company?.name || "Company Logo"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-2xl text-gray-500">🏢</div>
                        )}
                      </div>
                      <div className="mr-[6px]">
                        <h3 className="font-bold text-lg hover:text-blue-600 transition cursor-pointer flex items-center">
                          <FiBriefcase className="mr-2 text-blue-600" />

                          {job.title}
                        </h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <span className="text-gray-700 flex items-center">
                            <FiBriefcase className="mr-1 text-gray-500 flex-shrink-0" />
                            {job.company?.name || job.company || ""}
                          </span>
                          <span className="text-gray-700 flex items-center">
                            <FiMapPin className="mr-1 text-gray-500 flex-shrink-0" />
                            {job.location}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                            <FiClock className="mr-1" />
                            {job.type}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                            <FaRupeeSign className="mr-1 text-[10px] opacity-80" />
                            {job.salary} LPA
                          </span>
                          {/* {job.experience && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                              {job.experience}
                            </span>
                          )} */}
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                            <FiAward className="mr-1" />
                            {job.experience}
                          </span>
                          {/* {Array.isArray(job.requirements) &&
                            job.requirements.length > 0 &&
                            job.requirements.map((requirements, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {requirements}
                              </span>
                            ))} */}
                        </div>
                        {job.description && (
                          <div className="text-gray-700 text-sm line-clamp-2 mt-1">
                            <span className="font-medium">Description:</span>{" "}
                            {job.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end space-y-2">
                      <span className="text-sm text-gray-500">
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                      <Link
                        href={`/jobs/${job._id || job.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full md:w-32 text-center"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div
                className="text-4xl font-bold mb-2 count"
                data-target="12500"
              >
                0
              </div>
              <p className="text-blue-100">Jobs Posted</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="8500">
                0
              </div>
              <p className="text-blue-100">Companies Hiring</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="3200">
                0
              </div>
              <p className="text-blue-100">Candidates Hired</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold mb-2 count" data-target="95">
                0
              </div>
              <p className="text-blue-100">% Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people who found their dream jobs through our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Designer at TechCorp",
                quote:
                  "I found my dream job within a week of using CareerConnect. The platform made it so easy to connect with top companies.",
                avatar: "👩",
              },
              {
                name: "Michael Chen",
                role: "Senior Developer at InnovateCo",
                quote:
                  "The quality of job listings here is unmatched. I received multiple offers within days of creating my profile.",
                avatar: "👨",
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Director at BrandVision",
                quote:
                  "As an employer, we've hired exceptional talent through CareerConnect. It's our go-to platform for recruitment.",
                avatar: "👩",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="testimonial bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to take the next step in your career?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who found their dream jobs through
            our platform.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              href="/jobs"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
