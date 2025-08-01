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
  const [activeView, setActiveView] = useState("postedJobs"); // 'postedJobs' or 'allApplicants'
  const [company, setCompany] = useState(null);
  const [totalUniqueCandidates, setTotalUniqueCandidates] = useState(0);
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
    window.fetchJobs = fetchJobs;
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/unique-candidates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // Support both array and count response
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
          salary: parseFloat(form.salary), // Store as float (LPA)
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
      if (typeof window.fetchJobs === "function") {
        window.fetchJobs();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleStatusChange = async (jobId, applicantId, newStatus) => {
    // if (!window.confirm(`Are you sure you want to change the status of this applicant to "${newStatus}"?`)) {
    //   return;
    // }
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
    // if (window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
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
    // }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredPostedJobs = Array.isArray(jobs)
    ? jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const allApplicants = Array.isArray(jobs)
    ? jobs.reduce((acc, job) => {
        if (!job.applicants) return acc;
        const applicantsForJob = job.applicants.map((applicant) => ({
          ...applicant,
          jobTitle: job.title,
          jobId: job._id,
        }));
        return [...acc, ...applicantsForJob];
      }, [])
    : [];

  const filteredApplicants = allApplicants
    .filter((applicant) => {
      const matchesSearch =
        (applicant.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (applicant.jobTitle || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || applicant.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by appliedDate descending (latest first)
      const dateA = new Date(a.appliedDate || a.createdAt || 0);
      const dateB = new Date(b.appliedDate || b.createdAt || 0);
      return dateB - dateA;
    });

  const activeJobs = jobs.filter((job) => job.status === "active").length;
  const closedJobs = jobs.filter((job) => job.status === "closed").length;
  const archivedJobs = jobs.filter((job) => job.status === "archived").length;

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-14">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Employer Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your recruitment activity.
          </p>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {/* Total Jobs */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FiBriefcase className="text-blue-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Jobs</p>
            <p className="text-2xl font-bold">{jobs.length}</p>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FiCheckCircle className="text-green-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold">{activeJobs}</p>
          </div>
        </div>

        {/* Closed Jobs */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <FiXCircle className="text-red-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold">{closedJobs}</p>
          </div>
        </div>

        {/* Archived Jobs */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-gray-200 p-3 rounded-full mr-4">
            <FiArchive className="text-gray-600 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Archived</p>
            <p className="text-2xl font-bold">{archivedJobs}</p>
          </div>
        </div>

        {/* Total Applicants */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <FiUsers className="text-indigo-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Applicants</p>
            <p className="text-2xl font-bold">{totalApplicants}</p>
          </div>
        </div>

        {/*Your Total Candidates */}
        <div
          className="p-4  bg-white md:p-0 md:pl-4 rounded-lg shadow-sm flex items-center cursor-pointer"
          onClick={() => router.push("/recruiter-dashboard/candidates")}
        >
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <FiUserPlus className="text-indigo-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Candidates</p>
            <p className="text-2xl font-bold">{totalUniqueCandidates}
              <span className="text-blue-600 underline ml-2 text-sm font-light transition-colors duration-200 hover:text-blue-800 focus:outline-none">click here</span>
            </p>
          </div>
        </div>
      </div>

      {/* View switcher */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveView("postedJobs")}
          className={`px-4 py-2 text-sm font-medium ${
            activeView === "postedJobs"
              ? "border-b-1 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Posted Jobs
        </button>
        <button
          onClick={() => setActiveView("allApplicants")}
          className={`px-4 py-2 text-sm font-medium ${
            activeView === "allApplicants"
              ? "border-b-1 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Applicants
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Panel: Job Posting Form */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FiPlus className="mr-2 text-blue-600" />
            Post New Job
          </h2>
          {user && user.company === undefined && (
            <p className="mb-4 text-red-600 font-medium">
              No company linked to your profile.
            </p>
          )}
          {user && user.company && !company && (
            <p className="mb-4 text-gray-500 font-medium">
              Loading company details...
            </p>
          )}
          {company && (
            <p className="mb-4 text-blue-700 font-medium">
              Recruiting for: <span className="font-bold">{company.name}</span>
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

          <form onSubmit={handlePostJob}>
            {/* Form fields... */}
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Salary*
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
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={!requirementsInput.trim()}
                >
                  +
                </button>
              </div>
              {form.requirements.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {form.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirements(idx)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Responsibilities
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  name="responsibilities"
                  value={responsibilityInput}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a responsibility point"
                />
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  disabled={!responsibilityInput.trim()}
                >
                  +
                </button>
              </div>
              {form.responsibilities.length > 0 && (
                <ul className="list-disc pl-5 space-y-1">
                  {form.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(idx)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              disabled={posting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center cursor-pointer"
            >
              {posting ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>

        {/* Right Panel: Content based on active view */}
        <div className="lg:w-2/3 space-y-6">
          {activeView === "postedJobs" && (
            <>
              {filteredPostedJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                  <FiBriefcase className="mx-auto text-gray-400 text-4xl mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {searchTerm
                      ? "No matching jobs found"
                      : "No jobs posted yet"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try a different search term"
                      : "Use the form to post your first job"}
                  </p>
                </div>
              ) : (
                filteredPostedJobs
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((job) => (
                    <div key={job._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 mt-2 line-clamp-2 whitespace-pre-line">
                            {job.description}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                             <span>
                              <strong>Applicants:</strong> {job.applicants?.length || 0}
                            </span>
                            <span>
                              <strong>Type:</strong> {job.type}
                            </span>
                            <span>
                              <strong>Salary:</strong> {typeof job.salary === 'number' ? `${job.salary} LPA` : 'N/A'}
                            </span>
                            <span>
                              <strong>Experience:</strong> {job.experience || 'N/A'}
                            </span>
                           
                            <span>
                              <strong>Posted on:</strong> {formatDate(job.createdAt)}
                            </span>
                          </div>
                        </div>
                        <select
                          value={job.status}
                          onChange={(e) =>
                            handleJobStatusChange(job._id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium border-transparent focus:ring-1  ${
                            jobStatusColors[job.status]?.bg || "bg-gray-100"
                          } ${
                            jobStatusColors[job.status]?.text || "text-gray-800"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeView === "allApplicants" && (
            <div>
              {/* Filters for applicants */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {Object.keys(statusColors).map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      activeFilter === status
                        ? `${statusColors[status].bg} ${statusColors[status].text}`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {filteredApplicants.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
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
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 divide-y divide-gray-200">
                  {filteredApplicants.map((applicant) => {
                    // console.log("Applicant data:", applicant);
                    return (
                      <div
                        key={applicant._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start space-x-4 flex-1">
                          {/* {console.log(applicant)} */}
                            {applicant?.userId && applicant.userId.profilePhoto ? (
                              <img src={`${process.env.NEXT_PUBLIC_API_URL}${applicant.userId.profilePhoto}`} alt={applicant?.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-600">
                                <FiUser className="text-lg" />
                              </div>
                            )}
                           
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium text-gray-800 mr-2">
                                  {applicant.name}
                                </h4>
                                <span className="text-gray-500 text-sm">
                                  for
                                </span>
                                <span className="font-medium text-gray-800 ml-2">
                                  {applicant.jobTitle}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <FiMail className="mr-1" />
                                {applicant.email}
                              </div>
                              <div className="flex items-center text-gray-400 text-xs mt-2">
                                <FiClock className="mr-1"/> Applied on {formatDate(applicant.appliedDate)}
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
                                statusColors[applicant.status]?.bg ||
                                "bg-gray-100"
                              } ${
                                statusColors[applicant.status]?.text ||
                                "text-gray-800"
                              } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            >
                              {Object.keys(statusColors).map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </option>
                              ))}
                            </select>
                            {/* <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            View Profile
                          </button> */}
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
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}