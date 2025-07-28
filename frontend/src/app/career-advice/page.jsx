"use client";
import { FiTrendingUp, FiBriefcase, FiAward, FiUser, FiLayers, FiClock } from "react-icons/fi";
import Link from "next/link";

export default function CareerAdvicePage() {
  const articles = [
    {
      id: 1,
      title: "How to Build a Standout Resume in 2024",
      excerpt: "Learn the latest resume trends and what hiring managers really want to see.",
      category: "Resume",
      readTime: "6 min",
      icon: <FiTrendingUp className="text-purple-500" />,
      featured: true,
    },
    {
      id: 2,
      title: "The Ultimate Guide to Career Switching",
      excerpt: "Step-by-step plan for transitioning to a new career field successfully.",
      category: "Career Change",
      readTime: "8 min",
      icon: <FiBriefcase className="text-blue-500" />,
      featured: false,
    },
    {
      id: 3,
      title: "Networking Strategies for Introverts",
      excerpt: "Effective networking techniques that don't require being the loudest in the room.",
      category: "Networking",
      readTime: "5 min",
      icon: <FiUser className="text-green-500" />,
      featured: true,
    },
    {
      id: 4,
      title: "How to Ask for a Promotion",
      excerpt: "Timing, preparation, and conversation strategies to advance your career.",
      category: "Advancement",
      readTime: "7 min",
      icon: <FiAward className="text-yellow-500" />,
      featured: false,
    },
    {
      id: 5,
      title: "Remote Work Best Practices",
      excerpt: "How to stay productive and visible while working from home.",
      category: "Remote Work",
      readTime: "6 min",
      icon: <FiLayers className="text-red-500" />,
      featured: false,
    },
  ];

  const popularCategories = [
    { name: "Resume Tips", count: 24 },
    { name: "Career Growth", count: 18 },
    { name: "Job Search", count: 32 },
    { name: "Leadership", count: 12 },
    { name: "Workplace Skills", count: 27 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Career Advice & Resources
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Expert insights to help you grow and advance in your career
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.filter(a => a.featured).map((article) => (
              <div key={article.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {article.category}
                    </span>
                    <span className="ml-auto inline-flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      {article.readTime} read
                    </span>
                  </div>
                  <Link href={`/career-advice/${article.id}`} className="block mt-2">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      {article.excerpt}
                    </p>
                  </Link>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0 text-xl">
                      {article.icon}
                    </div>
                    <button className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      Read Article
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Latest Career Advice
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <div key={article.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-4 text-xl">
                        {article.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {article.category}
                          </span>
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            {article.readTime} read
                          </span>
                        </div>
                        <Link href={`/career-advice/${article.id}`} className="block mt-2">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                            {article.title}
                          </h3>
                          <p className="mt-3 text-base text-gray-500">
                            {article.excerpt}
                          </p>
                        </Link>
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
                  Popular Categories
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-4">
                  {popularCategories.map((category) => (
                    <li key={category.name} className="flex justify-between items-center">
                      <Link
                        href="#"
                        className="text-base font-medium text-gray-900 hover:text-blue-600"
                      >
                        {category.name}
                      </Link>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-blue-600">
                <h2 className="text-lg font-semibold text-white">
                  Career Growth Newsletter
                </h2>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700 mb-4">
                  Get weekly career tips, industry insights, and job search strategies
                  delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Your email address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Career Tools
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">•</span>
                      Resume Builder
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">•</span>
                      Cover Letter Templates
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">•</span>
                      Salary Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">•</span>
                      Career Path Explorer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <span className="mr-2">•</span>
                      Skills Assessment
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