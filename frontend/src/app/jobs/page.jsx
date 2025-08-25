"use client";
import React, { useEffect, useState } from "react";
// MobileFiltersModal component must be defined before JobsPage
function MobileFiltersModal({ filters, setFilters, clearFilters, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 mx-4 text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md  sm:p-6 border  border-black">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close filter modal"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={localFilters.type}
              onChange={handleLocalChange}
              name="type"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={localFilters.salary}
              onChange={handleLocalChange}
              name="salary"
            >
              <option value="">All Ranges</option>
              <option value="below-3">Below 3 LPA</option>
              <option value="3-6">3-6 LPA</option>
              <option value="6-10">6-10 LPA</option>
              <option value="10-plus">10+ LPA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={localFilters.experience}
              onChange={handleLocalChange}
              name="experience"
            >
              <option value="">All Levels</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              clearFilters();
              onClose();
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  FiSearch,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { LuIndianRupee } from "react-icons/lu";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    salary: "",
    experience: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expanded, setExpanded] = useState(false); // ✅ useState for toggle

  // Add this helper function near the top of the file (after imports):
  function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;
  }

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Build query params from filters
        const params = new URLSearchParams({
          page,
          limit: 10,
          status: "active", // Always filter for active jobs
          ...(filters.search && { search: filters.search }),
          ...(filters.location && { location: filters.location }),
          ...(filters.type && { type: filters.type }),
          ...(filters.salary && { salary: filters.salary }),
          ...(filters.experience && { experience: filters.experience }),
        });
        // console.log('Fetching jobs with params:', params.toString());

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs?${params}`
        );
        const data = await res.json();
        setJobs(data.jobs);
        setTotalPages(data.pages);
        setTotalJobs(data.total);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      type: "",
      salary: "",
      experience: "",
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 pt-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Browse thousands of job opportunities across all industries
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange(e)}
                  name="search"
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={(e) => handleFilterChange(e)}
                  name="location"
                />
              </div>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden px-4 py-3 bg-gray-100 rounded-lg flex items-center justify-center gap-2"
              >
                <FiFilter /> Filters
              </button>
              <button className="hidden md:block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiBriefcase /> Job Type
                  </h3>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.type}
                    onChange={(e) => handleFilterChange(e)}
                    name="type"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <LuIndianRupee /> Salary Range
                  </h3>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.salary}
                    onChange={(e) => handleFilterChange(e)}
                    name="salary"
                  >
                    <option value="">All Ranges</option>
                    <option value="below-3">Below 3 LPA</option>
                    <option value="3-6">3-6 LPA</option>
                    <option value="6-10">6-10 LPA</option>
                    <option value="10-plus">10+ LPA</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiClock /> Experience Level
                  </h3>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={filters.experience}
                    onChange={(e) => handleFilterChange(e)}
                    name="experience"
                  >
                    <option value="">All Levels</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {totalJobs} {totalJobs === 1 ? "Job" : "Jobs"} Available
              </h2>
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {job.company?.logo ? (
                              <img
                                src={job.company.logo}
                                alt={job.company?.name || "Company Logo"}
                                className="object-contain w-12 h-12 min-w-[54px] min-h-[54px] max-w-[54px] max-h-[54px] rounded-lg"
                                style={{ width: "54px", height: "54px" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-company.jpg";
                                }}
                              />
                            ) : (
                              <div className="text-xl text-gray-500">🏢</div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                              <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {job.company?.name || "Company Confidential"}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FiMapPin className="mr-1" /> {job.location}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <LuIndianRupee className="mr-1" /> {job.salary}{" "}
                                LPA
                              </span>
                              {job.experience && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                                  {job.experience}
                                </span>
                              )}
                              {job.type && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <FiBriefcase className="mr-1" /> {job.type}
                                </span>
                              )}
                            </div>
                            {/* {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                              <div className="text-gray-700 text-sm mt-2">
                                <span className="font-medium">Requirements:</span> {job.requirements.join(', ')}
                              </div>
                            )} */}
                            {job.description && (
                              <div className="text-gray-700 text-sm mt-2">
                                <span className="font-medium">
                                  Description:
                                </span>{" "}
                                {/* <span>
                                  {job.description
                                    .split(" ")
                                    .slice(0, 25)
                                    .join(" ")}
                                  {job.description.split(" ").length > 25
                                    ? "..."
                                    : ""}
                                </span> */}
                                <span className="line-clamp-2">
                                  {job.description}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <span className="text-sm text-gray-500">
                            {timeAgo(job.createdAt)}
                          </span>
                          <Link
                            href={`/jobs/${job._id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center flex items-center justify-center w-full md:w-[120px] md:h-[38px]"
                            style={{
                              fontSize: "16px",
                              lineHeight: "36px",
                              padding: 0,
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {page > 3 && (
                    <button
                      onClick={() => setPage(1)}
                      className="px-3 py-1 rounded border border-gray-300"
                    >
                      1
                    </button>
                  )}
                  {page > 4 && <span className="px-2">...</span>}

                  {[page - 2, page - 1, page, page + 1, page + 2]
                    .filter((p) => p > 0 && p <= totalPages)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded ${
                          page === p
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                  {page < totalPages - 3 && <span className="px-2">...</span>}
                  {page < totalPages - 2 && (
                    <button
                      onClick={() => setPage(totalPages)}
                      className="px-3 py-1 rounded border border-gray-300"
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {mobileFiltersOpen && (
        <MobileFiltersModal
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
          onClose={() => setMobileFiltersOpen(false)}
        />
      )}
    </div>
  );
}
