"use client";
import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiHome,
  FiCheck,
  FiX,
  FiUser,
  FiUserX,
  FiUserCheck,
  FiSearch,
  FiBarChart2,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "../components/AuthProvider";
import Link from "next/link";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    activeJobs: 0,
    pendingApprovals: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define tabs after all state declarations
  const tabs = [
    {
      name: "Users",
      icon: <FiUsers className="mr-2" />,
      count: stats.totalUsers,
    },
    {
      name: "Jobs",
      icon: <FiBriefcase className="mr-2" />,
      count: stats.totalJobs,
    },
    {
      name: "Companies",
      icon: <FiHome className="mr-2" />,
      count: stats.totalCompanies,
    },
  ];

  // Enhanced API handler with detailed logging
  const handleApiCall = async (endpoint, options = {}) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    // console.log(`Making request to: ${url}`); // Debugging

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...options,
      });

      // console.log(`Response status: ${response.status}`); // Debugging

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText); // Debugging

        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.message || `Request failed with status ${response.status}`
          );
        } catch {
          throw new Error(
            errorText || `Request failed with status ${response.status}`
          );
        }
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "Unexpected content type:",
          contentType,
          "Response:",
          text
        ); // Debugging
        throw new Error(`Unexpected response format from ${endpoint}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error); // Debugging
      throw error;
    }
  };

  // Fetch all dashboard data with error boundaries
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify API URL is correct
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured");
        }

        // Fetch data sequentially with error handling for each
        const [statsData, usersData, jobsData, companiesData] =
          await Promise.all([
            handleApiCall("/admin/stats").catch((e) => {
              console.error("Failed to fetch stats:", e);
              return {
                totalUsers: 0,
                totalJobs: 0,
                totalCompanies: 0,
                activeJobs: 0,
                pendingApprovals: 0,
              };
            }),
            handleApiCall("/admin/users").catch((e) => {
              console.error("Failed to fetch users:", e);
              return [];
            }),
            handleApiCall("/admin/jobs").catch((e) => {
              console.error("Failed to fetch jobs:", e);
              return [];
            }),
            handleApiCall("/admin/companies").catch((e) => {
              console.error("Failed to fetch companies:", e);
              return [];
            }),
          ]);

        setStats(statsData);
        setUsers(
          (usersData || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setJobs(
          (jobsData || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setCompanies(
          (companiesData || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
        setError(
          error.message ||
            "Failed to initialize dashboard. Please check console for details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError("Authentication required. Please log in.");
      setLoading(false);
    }
  }, [token]);

  // Action handlers with improved error feedback
  const handleUserAction = async (id, action) => {
    try {
      const updatedUser = await handleApiCall(`/admin/users/${id}/${action}`, {
        method: "PATCH",
      });
      setUsers((prev) => prev.map((u) => (u._id === id ? updatedUser : u)));
    } catch (error) {
      setError(`Failed to ${action} user: ${error.message}`);
    }
  };

  // Add or update handleJobAction and handleCompanyAction
  const handleJobAction = async (id, action) => {
    try {
      const updatedJob = await handleApiCall(`/admin/jobs/${id}/${action}`, {
        method: "PATCH",
      });
      setJobs((prev) => prev.map((j) => (j._id === id ? updatedJob : j)));
    } catch (error) {
      setError(`Failed to ${action} job: ${error.message}`);
    }
  };

  const handleCompanyAction = async (id, action) => {
    try {
      const updatedCompany = await handleApiCall(
        `/admin/companies/${id}/${action}`,
        {
          method: "PATCH",
        }
      );
      setCompanies((prev) =>
        prev.map((c) => (c._id === id ? updatedCompany : c))
      );
    } catch (error) {
      setError(`Failed to ${action} company: ${error.message}`);
    }
  };

  // Filter function with null checks
  const getFilteredData = () => {
    try {
      return {
        Users: (users || []).filter(
          (user) =>
            user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        Jobs: (jobs || []).filter(
          (job) =>
            job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        Companies: (companies || []).filter((company) =>
          company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      };
    } catch (error) {
      console.error("Filtering error:", error);
      return { Users: [], Jobs: [], Companies: [] };
    }
  };

  // Use the filtered data in your components
  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage users, jobs, and companies on the platform
          </p>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-64">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiUsers size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiBriefcase size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalJobs}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiHome size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Companies</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalCompanies}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiBarChart2 size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeJobs}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiClock size={20} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Approvals
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pendingApprovals}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex items-center px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.name
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon}
            {tab.name}
            <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs text-black">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.Users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          {user.profilePhoto ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePhoto}`}
                              alt={user.name}
                              className="h-full w-full rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = "/default-profile.jpg";
                              }}
                            />
                          ) : (
                            <FiUser />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "recruiter"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex justify-evenly">
                      {user.status === "active" ? (
                        <button
                          onClick={() => handleUserAction(user._id, "ban")}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <FiUserX className="mr-1" /> Ban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user._id, "activate")}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <FiUserCheck className="mr-1" /> Activate
                        </button>
                      )}
                      {/* <button
                        onClick={() => console.log(user)}
                        className="ml-2 text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiSearch className="mr-1" /> View
                      </button> */}
                      <Link
                        href={`/profile/${
                          user.userId?._id ||
                          user.user?._id ||
                          user.userId ||
                          user._id
                        }`}
                        className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiSearch className="mr-1" /> View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === "Jobs" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.Jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.company?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.applicants?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex justify-evenly">
                      {job.status === "active" ? (
                        <button
                          onClick={() => handleJobAction(job._id, "close")}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center"
                        >
                          <FiX className="mr-1" /> Close
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJobAction(job._id, "activate")}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <FiCheck className="mr-1" /> Activate
                        </button>
                      )}
                      {/* <button
                        onClick={() => console.log(job)}
                        className="ml-2 text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiSearch className="mr-1" /> View
                      </button> */}
                      <Link
                        href={`/jobs/${job._id}`}
                        className="ml-2 text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiSearch className="mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === "Companies" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs Posted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.Companies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {company.logo ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${company.logo}`}
                              alt={company.name}
                              className="h-full w-full rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = "/default-company.jpg";
                              }}
                            />
                          ) : (
                            <FiHome />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {company.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(company.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.jobs ? company.jobs.length : 0}
                      {/* {company.jobs && company.jobs.length > 0
                        ? company.jobs.map((job) => job.title).join(", ")
                        : "0"} */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          company.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex justify-evenly">
                      {company.status === "active" ? (
                        <button
                          onClick={() =>
                            handleCompanyAction(company._id, "deactivate")
                          }
                          className="text-yellow-600 hover:text-yellow-900 flex items-center"
                        >
                          <FiX className="mr-1" /> Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleCompanyAction(company._id, "activate")
                          }
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <FiCheck className="mr-1" /> Activate
                        </button>
                      )}
                      <Link
                        href={`/companies/${company._id}`}
                        className="ml-2 text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FiSearch className="mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
