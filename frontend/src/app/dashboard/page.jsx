'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const ChangePassword = dynamic(() => import('./components/changePassword'), { ssr: false });
const DeleteAccount = dynamic(() => import('./components/deleteAccount'), { ssr: false });
import Link from 'next/link'
import { useAuth } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import { FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiUser, FiMail, FiSettings, FiBell } from 'react-icons/fi'
import { FaChartLine } from 'react-icons/fa'

const statusIcons = {
  applied: <FiClock className="text-blue-500" />,
  interviewed: <FiMail className="text-yellow-500" />,
  accepted: <FiCheckCircle className="text-green-500" />,
  rejected: <FiXCircle className="text-red-500" />,
  offer: <FaChartLine className="text-purple-500" />
}

const statusColors = {
  applied: "bg-blue-100 text-blue-700",
  interviewed: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  documentation: "bg-purple-100 text-purple-800",
  offer: "bg-pink-100 text-pink-800",
  hired: "bg-teal-100 text-teal-800",
}

const statusLabels = {
  applied: "Applied",
  interviewed: "Interview",
  accepted: "Application Accepted",
  rejected: "Rejected",
  documentation: "Documentation",
  offer: "Offer",
  hired: "Hired",
}

export default function DashboardPage() {
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user, token, authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('applications')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (authLoading) {
      return
    }
    if (!user || !token) {
      setError("You must be logged in to view this page.")
      setTimeout(() => router.push("/login"), 1200)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        
        const appsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (appsResponse.status === 401) {
          setError("Session expired or unauthorized. Redirecting to login...")
          setTimeout(() => router.push("/login"), 1200)
          return
        }
        
        const appsData = await appsResponse.json()
        const jobsMap = {};
        await Promise.all(appsData.map(async (app) => {
          if (app.jobId) {
            if (!jobsMap[app.jobId]) {
              const jobRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${app.jobId}`);
              if (jobRes.ok) jobsMap[app.jobId] = await jobRes.json();
            }
            app.job = jobsMap[app.jobId];
          }
        }));

        appsData.sort((a, b) => {
          const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
          const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
          return dateB - dateA;
        });
        
        setApplications(appsData)

        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const statsData = await statsResponse.json()
        setStats(statsData)

      } catch (error) {
        console.error("Dashboard error:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, token, router, authLoading])

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <FiBell className="h-5 w-5 text-gray-500" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Stats Cards */}
          <div className="lg:w-1/3">
            {stats && (
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <FiBriefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <FiCheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500 truncate">Accepted</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.acceptedCount}</dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                        <FiMail className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500 truncate">Interviews</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.interviewCount}</dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <FaChartLine className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{stats.offerCount}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
              <div className="space-y-3">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">{label}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
                      {getStatusCount(status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Main Content */}
          <div className="lg:w-2/3">
            {/* Dashboard Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`${activeTab === 'applications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Applications
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`${activeTab === 'saved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Saved Jobs
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`${activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Content Area */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiXCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === 'applications' ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {applications.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by applying to jobs from our listings.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/jobs"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {applications.map((application) => (
                      <li key={application._id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${statusColors[application.status]}`}>
                                  {statusIcons[application.status]}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-600 truncate">
                                  {application.job?.title || 'Unknown Position'}
                                </p>
                                <p className="flex items-center text-sm text-gray-500">
                                  {application.job?.company?.name || 'Unknown Company'}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex flex-shrink-0">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
                                {statusLabels[application.status] || 'Unknown Status'}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <FiClock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                Applied on {new Date(application.appliedDate).toLocaleString()}
                              </p>
                              {application.lastUpdated && (
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  <FiMail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  Last updated {new Date(application.lastUpdated).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Link
                                href={`/jobs/${application.job?._id}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                View Job
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : activeTab === 'saved' ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="p-8 text-center">
                  <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No saved jobs</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Save jobs you're interested in to view them here later.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/jobs"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              </div>
            ) : activeTab === 'profile' ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.name || 'Not provided'}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email || 'Not provided'}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Resume</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user?.resume ? (
                          <a href={user.resume} className="text-blue-600 hover:text-blue-800">View Resume</a>
                        ) : (
                          'No resume uploaded'
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account preferences.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email preferences</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <button className="text-blue-600 hover:text-blue-800">Manage notifications</button>
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Password</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {!showChangePass ? (
                          <button type="button" className="text-blue-600 hover:text-blue-800" onClick={() => setShowChangePass(true)}>
                            Change password
                          </button>
                        ) : (
                          <ChangePassword
                            userId={user?._id}
                            token={token}
                            onSuccess={() => setShowChangePass(false)}
                            onCancel={() => setShowChangePass(false)}
                          />
                        )}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Delete account</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {!showDeleteAccount ? (
                          <button type="button" className="text-red-600 hover:text-red-800" onClick={() => setShowDeleteAccount(true)}>
                            Delete my account
                          </button>
                        ) : (
                          <DeleteAccount
                            userId={user?._id}
                            token={token}
                            onDeleted={() => {
                              setShowDeleteAccount(false);
                              // Optionally, log out or redirect after deletion
                              router.push("/login");
                            }}
                            onCancel={() => setShowDeleteAccount(false)}
                          />
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}