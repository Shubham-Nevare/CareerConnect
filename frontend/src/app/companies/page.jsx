"use client";
import { FiStar, FiMapPin, FiLink, FiUsers, FiDollarSign, FiBriefcase } from "react-icons/fi";
import Link from "next/link";


import { useEffect, useState } from "react";
import { FaBriefcase, FaRupeeSign } from "react-icons/fa";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`);
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : data.companies || []);
      } catch (err) {
        setError(err.message);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Education",
    "Energy",
    "Transportation",
    "Media",
    "Hospitality"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Companies
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover top employers and learn about their culture, benefits, and open positions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="sr-only">Search companies</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-1"
                  placeholder="Search companies..."
                />
              </div>
            </div>
            <div>
              <label htmlFor="industry" className="sr-only">Industry</label>
              <select
                id="industry"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-1"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="sr-only">Location</label>
              <select
                id="location"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-1"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="us">Mumbais</option>
                <option value="europe">Pune</option>
                <option value="asia">WFH</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Featured Companies
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6 text-center text-gray-400">Loading companies...</div>
                ) : error ? (
                  <div className="p-6 text-center text-red-500">{error}</div>
                ) : companies.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No companies found.</div>
                ) : (
                  companies.map((company) => (
                    <div key={company._id || company.id} className="p-6 hover:bg-gray-50 transition duration-150">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                          <img
                            className="h-16 w-16 rounded-full object-contain border border-gray-200"
                            src={company.logo ? (company.logo.startsWith('http') ? company.logo : `${process.env.NEXT_PUBLIC_API_URL}${company.logo}`) : '/default-company.jpg'}
                            alt={`${company.name} logo`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                              <Link href={`/companies/${company._id || company.id}`} className="hover:text-blue-600">
                                {company.name}
                              </Link>
                            </h3>
                            <div className="flex items-center">
                              <FiStar className="text-yellow-400" />
                              <span className="ml-1 text-sm font-medium text-gray-900">
                                {typeof company.rating === 'number' && !isNaN(company.rating) ? company.rating.toFixed(1) : '4.0'}
                              </span>
                              <span className="mx-1 text-gray-300">•</span>
                              <span className="text-sm text-gray-500">
                                {typeof company.reviews === 'number' && !isNaN(company.reviews) ? company.reviews : 100} reviews
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
                            <div className="flex items-center mr-4">
                              <FiMapPin className="mr-1" />
                              {company.location || 'N/A'}
                            </div>
                            <div className="flex items-center mr-4">
                              <FiUsers className="mr-1" />
                              {company.industry || 'N/A'}
                            </div>
                            <div className="flex items-center">
                              <FiBriefcase className="mr-1" />
                              {(company.jobs?.length || company.jobs || 0)} open jobs
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">
                            {(() => {
                              if (!company.description) return '';
                              const words = company.description.split(/\s+/);
                              if (words.length <= 30) return company.description;
                              return words.slice(0, 38).join(' ') + '...';
                            })()}
                          </p>
                          <div className="mt-4 flex space-x-3">
                            <Link
                              href={`/companies/${company._id || company.id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View Company
                            </Link>
                            <Link
                              href={`/jobs?company=${encodeURIComponent(company.name)}`}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                              View Jobs
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Industries
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3">
                  {industries.slice(0, 8).map((industry) => (
                    <li key={industry}>
                      <Link
                        href="#"
                        className="flex justify-between items-center text-gray-700 hover:text-blue-600"
                      >
                        <span>{industry}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          1,240
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recently Added Jobs
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-4">
                  {loading ? (
                    <li className="text-gray-400">Loading...</li>
                  ) : error ? (
                    <li className="text-red-500">{error}</li>
                  ) : companies.slice(0, 4).map((company) => (
                    <li key={company._id || company.id}>
                      <div className="text-sm font-medium text-gray-900">
                        <Link href="#" className="hover:text-blue-600">
                          Senior Software Engineer
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {company.name} • {company.location || 'N/A'}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        2 days ago • Full-time
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <Link
                    href="/jobs"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View all jobs →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-blue-600">
                <h2 className="text-lg font-semibold text-white">
                  Company Resources
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiLink className="mr-2" />
                      How to Research Companies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiLink className="mr-2" />
                      What Employers Look For
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiLink className="mr-2" />
                      Company Culture Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FiLink className="mr-2" />
                      Salary Benchmarking
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}