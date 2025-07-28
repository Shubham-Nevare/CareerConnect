"use client";
import { FiClock, FiUsers, FiBookOpen, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

export default function InterviewTipsPage() {
  const tips = [
    {
      id: 1,
      title: "10 Common Interview Questions and How to Answer Them",
      excerpt: "Learn how to answer the most frequently asked interview questions with confidence.",
      category: "Preparation",
      readTime: "5 min",
      icon: <FiCheckCircle className="text-blue-500" />,
    },
    {
      id: 2,
      title: "Body Language Tips for Video Interviews",
      excerpt: "Master the non-verbal communication skills that will make you stand out in virtual interviews.",
      category: "Virtual",
      readTime: "4 min",
      icon: <FiUsers className="text-green-500" />,
    },
    {
      id: 3,
      title: "How to Research a Company Before Your Interview",
      excerpt: "Discover the key information you should know about any company before you walk into the interview.",
      category: "Research",
      readTime: "6 min",
      icon: <FiBookOpen className="text-purple-500" />,
    },
    {
      id: 4,
      title: "Technical Interview Preparation Guide",
      excerpt: "A step-by-step guide to preparing for technical interviews at top tech companies.",
      category: "Technical",
      readTime: "8 min",
      icon: <FiClock className="text-yellow-500" />,
    },
    {
      id: 5,
      title: "Salary Negotiation Strategies That Work",
      excerpt: "Learn proven techniques to negotiate your salary with confidence.",
      category: "Negotiation",
      readTime: "7 min",
      icon: <FiCheckCircle className="text-red-500" />,
    },
    {
      id: 6,
      title: "How to Handle Behavioral Interview Questions",
      excerpt: "Use the STAR method to answer behavioral questions effectively.",
      category: "Behavioral",
      readTime: "5 min",
      icon: <FiUsers className="text-indigo-500" />,
    },
  ];

  const popularTopics = [
    "Technical Interviews",
    "Behavioral Questions",
    "Virtual Interviews",
    "Salary Negotiation",
    "Dress Code",
    "Follow-up Emails"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Interview Tips & Strategies
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Expert advice to help you ace your next interview
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Latest Interview Tips
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {tips.map((tip) => (
                  <div key={tip.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-4 text-xl">
                        {tip.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {tip.category}
                          </span>
                          <span className="inline-flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            {tip.readTime} read
                          </span>
                        </div>
                        <Link href={`/interview-tips/${tip.id}`} className="block mt-2">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                            {tip.title}
                          </h3>
                          <p className="mt-3 text-base text-gray-500">
                            {tip.excerpt}
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
                  Popular Topics
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map((topic) => (
                    <Link
                      key={topic}
                      href="#"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Interview Preparation Checklist
                </h2>
              </div>
              <div className="px-6 py-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Research the company and role
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Prepare answers to common questions
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Practice with mock interviews
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Prepare questions to ask the interviewer
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Plan your interview outfit
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-3">
                Need personalized help?
              </h3>
              <p className="text-blue-700 mb-4">
                Our career coaches can conduct mock interviews and give you
                personalized feedback.
              </p>
              <Link
                href="/career-coaching"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}