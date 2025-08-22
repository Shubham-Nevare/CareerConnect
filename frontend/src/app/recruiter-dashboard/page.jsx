"use client";
import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiUser,
  FiMail,
  FiBriefcase,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiArchive,
  FiUsers,
  FiClock,
  FiUserPlus,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiBarChart2,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "../components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusColors = {
  applied: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  accepted: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  interviewed: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  documentation: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  offer: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
  },
  hired: {
    bg: "bg-teal-100",
    text: "text-teal-800",
    border: "border-teal-200",
  },
};

const jobStatusColors = {
  active: {
    bg: "bg-green-100",
    text: "text-green-800",
  },
  closed: {
    bg: "bg-red-100",
    text: "text-red-800",
  },
  archived: {
    bg: "bg-gray-100",
    text: "text-gray-800",
  },
};

export default function RecruiterDashboard() {
  // Helper to limit description to N words
  function getFirstWords(text, wordCount) {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  }
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "Full-time",
    requirements: [],
    responsibilities: [],
    experience: "",
  });
  const [requirementsInput, setRequirementsInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'jobs', 'applicants'
  const [company, setCompany] = useState(null);
  const [totalUniqueCandidates, setTotalUniqueCandidates] = useState(0);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/recruiter`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (err) {
        setJobs([]);
      }
    };
    if (user && token) {
      fetchJobs();
    }
  }, [user, token]);

  useEffect(() => {
    const fetchCompany = async () => {
      if (user?.company) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/${user.company}`
        );
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
        }
      }
    };
    fetchCompany();
  }, [user]);

  useEffect(() => {
    const fetchTotalUniqueCandidates = async () => {
      try {
        if (!user?._id) {
          setTotalUniqueCandidates(0);
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/unique-candidates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data.candidates)) {
          setTotalUniqueCandidates(data.candidates.length);
        } else if (typeof data.count === "number") {
          setTotalUniqueCandidates(data.count);
        } else {
          setTotalUniqueCandidates(0);
        }
      } catch (err) {
        setTotalUniqueCandidates(0);
      }
    };
    fetchTotalUniqueCandidates();
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "responsibilities") {
      setResponsibilityInput(value);
    } else if (name === "requirements") {
      setRequirementsInput(value);
    } else {
      setForm({ ...form, [name]: value });
    }
    setError("");
    setSuccess("");
  };

  const handleAddRequirements = (e) => {
    e.preventDefault();
    const trimmed = requirementsInput.trim();
    if (trimmed) {
      setForm((prev) => ({
        ...prev,
        requirements: [...prev.requirements, trimmed],
      }));
      setRequirementsInput("");
    }
  };

  const handleRemoveRequirements = (idx) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== idx),
    }));
  };

  const handleAddResponsibility = (e) => {
    e.preventDefault();
    const trimmed = responsibilityInput.trim();
    if (trimmed) {
      setForm((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, trimmed],
      }));
      setResponsibilityInput("");
    }
  };

  const handleRemoveResponsibility = (idx) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.salary.toString().trim()
    ) {
      setError("All fields are required");
      return;
    }
    if (!(user._id || user.id)) {
      setError("Recruiter ID not found. Please log in again.");
      return;
    }
    if (!company?._id) {
      setError("Company not loaded. Please try again later.");
      return;
    }

    setPosting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description,
          location: form.location.trim(),
          salary: parseFloat(form.salary),
          company: company._id,
          type: form.type,
          requirements: form.requirements,
          responsibilities: form.responsibilities,
          experience: form.experience,
          recruiterId: user._id || user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post job");
      setSuccess("Job posted successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        type: "Full-time",
        requirements: [],
        responsibilities: [],
        experience: "",
      });
      setRequirementsInput("");
      setResponsibilityInput("");
      setShowJobForm(false);

      // Refresh jobs
      const jobsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/recruiter`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jobsData = await jobsRes.json();
      setJobs(Array.isArray(jobsData) ? jobsData : jobsData.jobs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleStatusChange = async (jobId, applicantId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicantId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      setJobs(
        jobs.map((job) => {
          if (job._id === jobId) {
            return {
              ...job,
              applicants: job.applicants.map((app) =>
                app._id === applicantId ? { ...app, status: newStatus } : app
              ),
            };
          }
          return job;
        })
      );
      alert("Applicant status updated successfully!");
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleJobStatusChange = async (jobId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update job status");
      }

      const updatedJob = await res.json();
      setJobs(jobs.map((job) => (job._id === jobId ? updatedJob : job)));
      alert("Job status updated successfully!");
    } catch (err) {
      console.error("Failed to update job status:", err);
      alert(err.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Debug: log jobs and user to diagnose recruiterJobs filter
  // console.log("DEBUG: jobs", jobs); // this is a total company jobs list
  // console.log("DEBUG: user", user); // user.jobPosts is an array of job IDs
  // If user.jobPosts exists and is an array, use it to filter jobs
  let recruiterJobs = [];
  if (Array.isArray(user?.jobPosts) && user.jobPosts.length > 0) {
    recruiterJobs = Array.isArray(jobs)
      ? jobs.filter(
          (job) =>
            user.jobPosts.includes(job._id) || user.jobPosts.includes(job.id)
        )
      : [];
  } else {
    // fallback to recruiterId matching if jobPosts is not present
    const getRecruiterIdFromJob = (job) => {
      if (
        typeof job.recruiterId === "string" ||
        typeof job.recruiterId === "number"
      )
        return job.recruiterId;
      if (
        job.recruiterId &&
        typeof job.recruiterId === "object" &&
        job.recruiterId._id
      )
        return job.recruiterId._id;
      if (
        typeof job.recruiter === "string" ||
        typeof job.recruiter === "number"
      )
        return job.recruiter;
      if (
        job.recruiter &&
        typeof job.recruiter === "object" &&
        job.recruiter._id
      )
        return job.recruiter._id;
      if (job.createdBy && typeof job.createdBy === "string")
        return job.createdBy;
      return null;
    };
    const recruiterId = user?._id || user?.id;
    recruiterJobs = Array.isArray(jobs)
      ? jobs.filter((job) => getRecruiterIdFromJob(job) === recruiterId)
      : [];
  }

  const filteredPostedJobs = recruiterJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allApplicants = recruiterJobs.reduce((acc, job) => {
    if (!job.applicants) return acc;
    const applicantsForJob = job.applicants.map((applicant) => ({
      ...applicant,
      jobTitle: job.title,
      jobId: job._id,
    }));
    return [...acc, ...applicantsForJob];
  }, []);

  const filteredApplicants = allApplicants
    .filter((applicant) => {
      const matchesSearch =
        (applicant.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (applicant.jobTitle || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || applicant.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.createdAt || 0);
      const dateB = new Date(b.appliedDate || b.createdAt || 0);
      return dateB - dateA;
    });

  const activeJobs = recruiterJobs.filter(
    (job) => job.status === "active"
  ).length;
  const closedJobs = recruiterJobs.filter(
    (job) => job.status === "closed"
  ).length;
  const archivedJobs = recruiterJobs.filter(
    (job) => job.status === "archived"
  ).length;

  const totalApplicants = recruiterJobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  // Company stats
  const companyActiveJobs = jobs.filter(
    (job) => job.status === "active"
  ).length;
  const companyClosedJobs = jobs.filter(
    (job) => job.status === "closed"
  ).length;
  const companyArchivedJobs = jobs.filter(
    (job) => job.status === "archived"
  ).length;
  const companyTotalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back,{" "}
            <span className="text-xl font-black">
              {user?.name || "Recruiter"}
            </span>
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs or applicants..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
          >
            <FiPlus className="mr-2" />
            New Job
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-3 text-sm font-medium flex items-center cursor-pointer ${
            activeTab === "dashboard"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiHome className="mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-3 text-sm font-medium flex items-center cursor-pointer ${
            activeTab === "jobs"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiBriefcase className="mr-2" />
          Jobs ({recruiterJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("applicants")}
          className={`px-4 py-3 text-sm font-medium flex items-center cursor-pointer ${
            activeTab === "applicants"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiUsers className="mr-2" />
          Applicants ({allApplicants.length})
        </button>
      </div>

      {/* Stats Toggle */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Performance Overview
        </h2>
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showStats ? (
            <FiChevronUp className="mr-1" />
          ) : (
            <FiChevronDown className="mr-1" />
          )}
          {showStats ? "Hide Stats" : "Show Stats"}
        </button>
      </div>

      {/* Stats Overview - Collapsible */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Your Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                          <FiBarChart2 className="mr-2 text-blue-500" />

              Your Performance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-200 p-2 rounded-full mr-3">
                    <FiBriefcase className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Your Jobs</p>
                    <p className="text-xl font-bold">{recruiterJobs.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-200 p-2 rounded-full mr-3">
                    <FiCheckCircle className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-xl font-bold">{activeJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <FiXCircle className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Closed</p>
                    <p className="text-xl font-bold">{closedJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-200 p-2 rounded-full mr-3">
                    <FiUsers className="text-indigo-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applicants</p>
                    <p className="text-xl font-bold">{totalApplicants}</p>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-200 p-2 rounded-full mr-3">
                    <FiArchive className="text-indigo-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Archived</p>
                    <p className="text-xl font-bold">{archivedJobs}</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => router.push("/recruiter-dashboard/candidates")}
                className="bg-blue-100 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-blue-200 p-2 rounded-full mr-3">
                    <FiUserPlus className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Candidates</p>
                    <p className="text-xl font-bold">
                      {totalUniqueCandidates}
                      <span className="ml-2 text-xs text-blue-600 mt-1">
                        View all →
                      </span>
                    </p>
                    {/* <p className="text-xs text-blue-600 mt-1">View all →</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiBarChart2 className="mr-2 text-blue-500" />
              Company Overview
              {company && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({company.name})
                </span>
              )}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-200 p-2 rounded-full mr-3">
                    <FiBriefcase className="text-gray-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Jobs</p>
                    <p className="text-xl font-bold">{jobs.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-200 p-2 rounded-full mr-3">
                    <FiCheckCircle className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-xl font-bold">{companyActiveJobs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-purple-200 p-2 rounded-full mr-3">
                    <FiUsers className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applicants</p>
                    <p className="text-xl font-bold">
                      {companyTotalApplicants}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <FiXCircle className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Closed</p>
                    <p className="text-xl font-bold">{companyClosedJobs}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Posting Form - Conditional */}
      {showJobForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiPlus className="mr-2 text-blue-600" />
              Post New Job
            </h2>
            <button
              onClick={() => setShowJobForm(false)}
              className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              &times;
            </button>
          </div>

          {company ? (
            <p className="mb-4 text-blue-700 font-medium">
              Recruiting for: <span className="font-bold">{company.name}</span>
            </p>
          ) : (
            <p className="mb-4 text-gray-500 font-medium">
              Loading company details...
            </p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form
            onSubmit={handlePostJob}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Job Title*
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the job..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location*
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Remote, Mumbai"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Salary (LPA)*
              </label>
              <input
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 10 for 10 LPA"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Experience
              </label>
              <select
                name="experience"
                value={form.experience || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Skills / Requirements
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  name="requirements"
                  value={requirementsInput}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a skill or requirement"
                />
                <button
                  type="button"
                  onClick={handleAddRequirements}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                  disabled={!requirementsInput.trim()}
                >
                  +
                </button>
              </div>
              {form.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.requirements.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirements(idx)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Responsibilities
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  name="responsibilities"
                  value={responsibilityInput}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  placeholder="Enter a responsibility point"
                />
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                  disabled={!responsibilityInput.trim()}
                >
                  +
                </button>
              </div>
              {form.responsibilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.responsibilities.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(idx)}
                        className="ml-2 text-green-600 hover:text-green-800"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={posting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 cursor-pointer"
              >
                {posting ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Jobs
              </h3>
              <button
                onClick={() => setActiveTab("jobs")}
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                View all
              </button>
            </div>

            {recruiterJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiBriefcase className="mx-auto text-3xl mb-2" />
                <p>No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recruiterJobs
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map((job) => (
                    <div
                      key={job._id}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50">
                            <FiBriefcase className="text-blue-500 text-xl" />
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {job.title}
                            </h4>
                          </div>
                        </div>
                        <div className="gap-4 flex items-center">
                          <div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                jobStatusColors[job.status]?.bg
                              } ${jobStatusColors[job.status]?.text}`}
                            >
                              {job.status}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {job.applicants?.length || 0} applicants
                            </span>
                          </div>
                          <div>
                            {" "}
                            <span className="text-sm text-gray-500">
                              {formatDate(job.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Applicants */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Applicants
              </h3>
              <button
                onClick={() => setActiveTab("applicants")}
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                View all
              </button>
            </div>

            {allApplicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiUser className="mx-auto text-3xl mb-2" />
                <p>No applicants yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allApplicants
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.appliedDate || b.createdAt) -
                      new Date(a.appliedDate || a.createdAt)
                  )
                  .reverse()
                  .slice(0, 3)
                  .map((applicant) => (
                    <div
                      key={applicant._id}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50">
                            <FiUser className="text-indigo-500 text-xl" />
                          </span>
                          <div>
                            <h4 className="font-normal text-gray-500">
                              <span className=" font-medium text-gray-800">
                                {applicant.name}
                              </span>{" "}
                              for{" "}
                              <span className=" font-medium text-gray-800">
                                {applicant.jobTitle}
                              </span>
                            </h4>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            statusColors[applicant.status]?.bg
                          } ${statusColors[applicant.status]?.text}`}
                        >
                          {applicant.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(applicant.appliedDate)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 w-fit justify-center mx-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Your Job Postings
            </h3>
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-500" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Jobs</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {filteredPostedJobs.length === 0 ? (
            <div className="p-8 text-center">
              <FiBriefcase className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchTerm || activeFilter !== "all"
                  ? "No matching jobs found"
                  : "No jobs posted yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || activeFilter !== "all"
                  ? "Try a different search or filter"
                  : "Post your first job to get started"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 w-4xl max-w-4xl mx-auto">
              {filteredPostedJobs
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((job) => (
                  <div
                    key={job._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="flex items-start gap-3 min-w-0 w-full max-w-2xl">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 flex-shrink-0">
                          <FiBriefcase className="text-blue-500 text-xl" />
                        </span>
                        <div className="min-w-1 w-full">
                          <h3 className="text-lg font-semibold text-gray-800 truncate max-w-lg">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 mt-1 max-w-2xl">
                            {getFirstWords(job.description, 25)}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>
                              <strong>Applicants:</strong>{" "}
                              {job.applicants?.length || 0}
                            </span>
                            <span>
                              <strong>Type:</strong> {job.type}
                            </span>
                            <span>
                              <strong>Salary:</strong> {job.salary} LPA
                            </span>
                            <span>
                              <strong>Experience:</strong>{" "}
                              {job.experience || "N/A"}
                            </span>
                            <span>
                              <strong>Posted on:</strong>{" "}
                              {formatDate(job.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleJobStatusChange(job._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium border focus:ring-1 cursor-pointer  ${
                          jobStatusColors[job.status]?.bg || "bg-gray-100"
                        } ${
                          jobStatusColors[job.status]?.text || "text-gray-800"
                        }`}
                        style={{ minWidth: 110 }}
                      >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "applicants" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 w-fit justify-center mx-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Applicants</h3>
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-500" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {Object.keys(statusColors).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filteredApplicants.length === 0 ? (
            <div className="p-8 text-center">
              <FiUser className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchTerm || activeFilter !== "all"
                  ? "No matching applicants"
                  : "No applicants yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || activeFilter !== "all"
                  ? "Try a different search or filter"
                  : "Applicants for your jobs will appear here"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 w-3xl max-w-3xl mx-auto">
              {filteredApplicants
                .sort(
                  (a, b) =>
                    new Date(b.appliedDate || b.createdAt) -
                    new Date(a.appliedDate || a.createdAt)
                )
                .map((applicant) => (
                  <div
                    key={applicant._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                      <div className="flex items-start space-x-4 flex-1 min-w-0 max-w-2xl">
                        {applicant?.userId && applicant.userId.profilePhoto ? (
                          <img
                            src={`${applicant.userId.profilePhoto}`}
                            alt={applicant?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-600">
                            <FiUser className="text-lg" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center min-w-0">
                            <h4 className="font-medium text-gray-800 mr-2 truncate max-w-xs">
                              {applicant.name}
                            </h4>
                            <span className="text-gray-500 text-sm">for</span>
                            <span className="font-medium text-gray-800 ml-2 truncate max-w-xs">
                              {applicant.jobTitle}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm mt-1 truncate max-w-md">
                            <FiMail className="mr-1" />
                            {applicant.email}
                          </div>
                          <div className="flex items-center text-gray-400 text-xs mt-2">
                            <FiClock className="mr-1" /> Applied on{" "}
                            {formatDate(applicant.appliedDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <select
                          value={applicant.status}
                          onChange={(e) =>
                            handleStatusChange(
                              applicant.jobId,
                              applicant._id,
                              e.target.value
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[applicant.status]?.bg || "bg-gray-100"
                          } ${
                            statusColors[applicant.status]?.text ||
                            "text-gray-800"
                          } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        >
                          {Object.keys(statusColors).map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <Link
                          href={`/profile/${
                            applicant.userId?._id ||
                            applicant.user?._id ||
                            applicant.userId ||
                            applicant._id
                          }`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
