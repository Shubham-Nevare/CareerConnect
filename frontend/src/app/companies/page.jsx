"use client";
import { FiStar, FiMapPin, FiLink, FiUsers, FiDollarSign } from "react-icons/fi";
import Link from "next/link";

export default function CompaniesPage() {
  const companies = [
    {
      id: 1,
      name: "TechNova Solutions",
      logo: "/company-logos/technova.png",
      industry: "Software Development",
      rating: 4.5,
      reviews: 128,
      location: "San Francisco, CA",
      jobs: 24,
      description: "Leading provider of enterprise software solutions with a focus on AI and machine learning.",
    },
    {
      id: 2,
      name: "GreenEarth Energy",
      logo: "/company-logos/greenearth.png",
      industry: "Renewable Energy",
      rating: 4.2,
      reviews: 86,
      location: "Austin, TX",
      jobs: 15,
      description: "Pioneers in sustainable energy solutions and green technology innovations.",
    },
    {
      id: 3,
      name: "Global Finance Corp",
      logo: "/company-logos/globalfinance.png",
      industry: "Financial Services",
      rating: 3.9,
      reviews: 215,
      location: "New York, NY",
      jobs: 32,
      description: "International banking and financial services company with operations in 40+ countries.",
    },
    {
      id: 4,
      name: "HealthPlus Systems",
      logo: "/company-logos/healthplus.png",
      industry: "Healthcare Technology",
      rating: 4.1,
      reviews: 97,
      location: "Boston, MA",
      jobs: 18,
      description: "Innovative healthcare IT solutions improving patient outcomes worldwide.",
    },
    {
      id: 5,
      name: "UrbanFood Delivery",
      logo: "/company-logos/urbanfood.png",
      industry: "Food Technology",
      rating: 4.0,
      reviews: 156,
      location: "Chicago, IL",
      jobs: 12,
      description: "Revolutionizing food delivery with smart logistics and sustainable packaging.",
    },
    {
      id: 6,
      name: "EduFuture Learning",
      logo: "/company-logos/edufuture.png",
      industry: "Education Technology",
      rating: 4.3,
      reviews: 72,
      location: "Seattle, WA",
      jobs: 9,
      description: "Transforming education through adaptive learning platforms and AI tutors.",
    },
  ];

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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search companies..."
                />
              </div>
            </div>
            <div>
              <label htmlFor="industry" className="sr-only">Industry</label>
              <select
                id="industry"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="us">United States</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
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
                {companies.map((company) => (
                  <div key={company.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                        <img
                          className="h-16 w-16 rounded-full object-contain border border-gray-200"
                          src={company.logo}
                          alt={`${company.name} logo`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link href={`/companies/${company.id}`} className="hover:text-blue-600">
                              {company.name}
                            </Link>
                          </h3>
                          <div className="flex items-center">
                            <FiStar className="text-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {company.rating}
                            </span>
                            <span className="mx-1 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              {company.reviews} reviews
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
                          <div className="flex items-center mr-4">
                            <FiMapPin className="mr-1" />
                            {company.location}
                          </div>
                          <div className="flex items-center mr-4">
                            <FiUsers className="mr-1" />
                            {company.industry}
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="mr-1" />
                            {company.jobs} open jobs
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          {company.description}
                        </p>
                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/companies/${company.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Company
                          </Link>
                          <Link
                            href={`/companies/${company.id}/jobs`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            View Jobs
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  {companies.slice(0, 4).map((company) => (
                    <li key={company.id}>
                      <div className="text-sm font-medium text-gray-900">
                        <Link href="#" className="hover:text-blue-600">
                          Senior Software Engineer
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {company.name} • {company.location}
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