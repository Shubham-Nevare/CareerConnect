"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiPhone,
  FiUser,
  FiSearch,
  FiDownload,
  FiFilter,
  FiCheck,
  FiX,
  FiEye,
  FiStar,
  FiCalendar,
  FiBriefcase,
  FiBook,
  FiArrowLeft,
} from "react-icons/fi";

export default function AdvancedCandidateSearch() {
  const router = useRouter();
  // Handle View button for table and grid
  const handleViewCandidate = (candidate) => {
    if (candidate && candidate.id) {
      router.push(`/profile/${candidate.id}`);
    }
  };

  // Back button handler
  const handleBack = () => {
    router.back();
  };
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // On mount, sync viewMode from localStorage (client only)
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("candidateViewMode")
        : null;
    if (stored && (stored === "table" || stored === "grid")) {
      setViewMode(stored);
    }
  }, []);

  // Persist viewMode to localStorage when it changes (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("candidateViewMode", viewMode);
    }
  }, [viewMode]);
  const [filters, setFilters] = useState({
    status: "all",
    experience: "",
    education: "",
    skills: "",
    location: "",
    availability: "",
    dateRange: "all",
  });

  // Fetch candidates data
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/applications`
        );
        const applications = await res.json();

        // Helper to fetch user details if missing
        const fetchUserDetails = async (userId) => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
            );
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        };

        // Build candidate list, fetching user details if needed
        const buildCandidates = async () => {
          const candidateMap = new Map();
          const promises = applications.map(async (app) => {
            const id = app.userId._id || app.userId;
            // Use app.userId fields if present, else fetch from users collection
            let user = app.userId;
            let userDetails = {};
            if (
              !user.profilePhoto ||
              !user.phone ||
              !user.profile ||
              !user.resume
            ) {
              // Fetch from users collection if missing important fields
              const fetched = await fetchUserDetails(id);
              if (fetched) userDetails = fetched;
            }
            // Merge user and userDetails, prefer userDetails for missing fields
            // Prefer skills/experience from profile if available
            const merged = {
              id,
              name: user.name || userDetails.name || app.name,
              email: user.email || userDetails.email || app.email,
              phone:
                userDetails.profile &&
                userDetails.profile.basicInfo &&
                userDetails.profile.basicInfo.phone
                  ? userDetails.profile.basicInfo.phone
                  : null,
              profilePhoto:
                user.profilePhoto || userDetails.profilePhoto || null,

              status: app.status
                ? app.status.charAt(0).toUpperCase() +
                  app.status.slice(1).toLowerCase()
                : "Applied",
              dateApplied: new Date(app.createdAt),
              skills: userDetails.profile.skills || [],
              experience: userDetails.profile.experience || [],
              education: userDetails.profile.education || [],
              location: user.location || userDetails.location || "Remote",
              resume:
                userDetails.profile &&
                userDetails.profile.resume &&
                userDetails.profile.resume.url
                  ? userDetails.profile.resume.url
                  : null,
              matchScore: Math.floor(Math.random() * 30) + 70, // Random match score 70-100
            };
            // Use email as unique key if available, else id
            const uniqueKey = merged.email ? merged.email.toLowerCase() : id;
            if (!uniqueKey || candidateMap.has(uniqueKey)) return null;
            candidateMap.set(uniqueKey, merged);
            return merged;
          });
          // Only keep unique candidates
          const candidatesArr = (await Promise.all(promises)).filter(Boolean);
          setCandidates(candidatesArr);
          setFilteredCandidates(candidatesArr);
        };
        await buildCandidates();
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = candidates.filter((candidate) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills?.some((skill) =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        candidate.status.toLowerCase() === filters.status.toLowerCase();

      // Experience filter
      const matchesExperience =
        filters.experience === "" ||
        candidate.experience?.some(
          (exp) => exp.years >= parseInt(filters.experience)
        );

      // Education filter
      const matchesEducation =
        filters.education === "" ||
        candidate.education?.some((edu) =>
          edu.degree.toLowerCase().includes(filters.education.toLowerCase())
        );

      // Skills filter
      const matchesSkills =
        filters.skills === "" ||
        candidate.skills?.some((skill) =>
          skill.name.toLowerCase().includes(filters.skills.toLowerCase())
        );

      // Location filter
      const matchesLocation =
        filters.location === "" ||
        candidate.location
          .toLowerCase()
          .includes(filters.location.toLowerCase());

      // Date range filter
      const matchesDateRange =
        filters.dateRange === "all" ||
        (filters.dateRange === "7" && isWithinDays(candidate.dateApplied, 7)) ||
        (filters.dateRange === "30" &&
          isWithinDays(candidate.dateApplied, 30)) ||
        (filters.dateRange === "90" && isWithinDays(candidate.dateApplied, 90));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesExperience &&
        matchesEducation &&
        matchesSkills &&
        matchesLocation &&
        matchesDateRange
      );
    });

    setFilteredCandidates(results);
  }, [searchTerm, filters, candidates]);

  const isWithinDays = (date, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return new Date(date) >= cutoffDate;
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id)
        ? prev.filter((candidateId) => candidateId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map((c) => c.id));
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      // case "email": {
      //   let emails = [];
      //   if (selectedCandidates.length > 0) {
      //     emails = filteredCandidates
      //       .filter((c) => selectedCandidates.includes(c.id))
      //       .map((c) => c.email)
      //       .filter((email) => email);
      //   } else {
      //     emails = filteredCandidates.map((c) => c.email).filter((email) => email);
      //   }
      //   if (emails.length > 0) {
      //     const subject = encodeURIComponent("Job Opportunity at Our Company");
      //     const body = encodeURIComponent("Dear Candidate,\n\nWe are reaching out regarding your application. Please let us know if you are interested in proceeding further.\n\nRegards,\nRecruitment Team");
      //     const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&bcc=${encodeURIComponent(emails.join(","))}&su=${subject}&body=${body}`;
      //     window.open(gmailUrl, "_blank");
      //   }
      //   break;
      // }
      case "email": {
        try {
          // Get selected emails or all filtered candidates if none selected
          let emails = [];
          if (selectedCandidates.length > 0) {
            emails = filteredCandidates
              .filter((c) => selectedCandidates.includes(c.id))
              .map((c) => c.email)
              .filter((email) => {
                if (!email) {
                  console.warn(`Candidate ${c.id} has no email address`);
                  return false;
                }
                return true;
              });
          } else {
            emails = filteredCandidates
              .map((c) => c.email)
              .filter((email) => {
                if (!email) {
                  console.warn(`Candidate ${c.id} has no email address`);
                  return false;
                }
                return true;
              });
          }

          if (emails.length === 0) {
            alert("No valid email addresses found for selected candidates");
            break;
          }

          // Prepare email content
          const subject = encodeURIComponent("Job Opportunity at Our Company");
          const body = encodeURIComponent(
            `Dear Candidate,\n\n` +
              `We are reaching out regarding your application. ` +
              `Please let us know if you are interested in proceeding further.\n\n` +
              `Regards,\n` +
              `Recruitment Team\n\n` +
              `---\n` +
              `This email was sent via CareerConnect`
          );

          // Check if we should use Gmail or default mail client
          const useGmail = window.confirm(
            `You are about to email ${emails.length} candidate(s).\n` +
              `Would you like to use Gmail? (Cancel will use your default email client)`
          );

          if (useGmail) {
            // Open Gmail compose window with BCC
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&bcc=${encodeURIComponent(
              emails.join(",")
            )}&su=${subject}&body=${body}`;
            const gmailWindow = window.open(gmailUrl, "_blank");

            if (!gmailWindow) {
              alert(
                "Popup blocked. Please allow popups for this site or try the default email option."
              );
            }
          } else {
            // Fallback to default mailto: behavior
            window.location.href = `mailto:?bcc=${emails.join(
              ","
            )}&subject=${subject}&body=${body}`;
          }

          // Log the email action for analytics
          console.log(`Email initiated to ${emails.length} candidates`, emails);
        } catch (error) {
          console.error("Error initiating email:", error);
          alert(
            "Failed to initiate email. Please try again or contact support."
          );
        }
        break;
      }
      case "download": {
        const selected = filteredCandidates.filter((c) =>
          selectedCandidates.includes(c.id)
        );
        if (selected.length === 0) {
          alert("No candidates selected for download.");
          return;
        }
        selected.forEach(async (candidate, idx) => {
          if (!candidate.resume) return;
          let resumeUrl = candidate.resume;
          if (!resumeUrl.startsWith("http")) {
            resumeUrl = `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`;
          }
          try {
            const response = await fetch(resumeUrl, { method: "GET" });
            if (!response.ok) throw new Error("Failed to download resume");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            // Use candidate name or fallback for filename
            let filename =
              resumeUrl.split("/").pop() || `resume_${idx + 1}.pdf`;
            if (candidate.name) {
              filename = candidate.name.replace(/\s+/g, "_") + "_resume.pdf";
            }
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            // Optionally show error for this candidate
          }
        });
        break;
      }
      case "shortlist":
        // Update status in backend
        alert(`Shortlisted ${selectedCandidates.length} candidates`);
        break;
      default:
        break;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Download CV handler
  const handleDownloadCV = async (candidate) => {
    if (!candidate || !candidate.resume) {
      alert("No resume available for this candidate.");
      return;
    }
    try {
      let resumeUrl = candidate.resume;
      // If resume is a relative path, prepend API URL
      if (!resumeUrl.startsWith("http")) {
        resumeUrl = `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`;
      }
      // Fetch the file as blob
      const response = await fetch(resumeUrl, {
        method: "GET",
        headers: {
          // Add auth headers if needed
        },
      });
      if (!response.ok) throw new Error("Failed to download resume");
      const blob = await response.blob();
      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Try to get filename from URL or fallback
      const filename = resumeUrl.split("/").pop() || "resume.pdf";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading resume.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <button
          className="mb-6 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
          onClick={handleBack}
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Advanced Candidate Search
          </h1>
          <p className="text-gray-600">Find and manage your ideal candidates</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or skills..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
          >
            <option value="">Experience</option>
            <option value="1">1+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filters.education}
            onChange={(e) =>
              setFilters({ ...filters, education: e.target.value })
            }
          >
            <option value="">Education</option>
            <option value="Bachelor">Bachelor's</option>
            <option value="Master">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
          </select>

          <input
            type="text"
            placeholder="Skills"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filters.skills}
            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
          />

          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ ...filters, dateRange: e.target.value })
            }
          >
            <option value="all">All Dates</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <div className="bg-blue-50 rounded-lg shadow p-4 mb-6 flex justify-between items-center">
          <div className="text-blue-800 font-medium">
            {selectedCandidates.length} candidate(s) selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleBulkAction("email")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FiMail className="mr-2" /> Email
            </button>
            <button
              onClick={() => handleBulkAction("download")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <FiDownload className="mr-2" /> Download CVs
            </button>
            <button
              onClick={() => handleBulkAction("shortlist")}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            >
              <FiStar className="mr-2" /> Shortlist
            </button>
          </div>
        </div>
      )}

      {/* Candidates Display */}
      {loading ? (
        <div className="p-8 text-center">Loading candidates...</div>
      ) : filteredCandidates.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No candidates found matching your criteria. Try adjusting your
          filters.
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedCandidates.length ===
                          filteredCandidates.length &&
                        filteredCandidates.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Candidate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Match Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Skills
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applied
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {/* {console.log(candidate)} */}
                          {candidate.profilePhoto ? (
                            <img
                              src={
                                candidate.profilePhoto.startsWith("http")
                                  ? candidate.profilePhoto
                                  : `${process.env.NEXT_PUBLIC_API_URL}${candidate.profilePhoto}`
                              }
                              alt={candidate.name || "Profile"}
                              className="h-10 w-10 object-cover rounded-full"
                            />
                          ) : (
                            <FiUser className="text-gray-500 text-xl" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.name || "No Name"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidate.email || "No Email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${candidate.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {candidate.matchScore}% match
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          candidate.status === "Shortlisted" ||
                          candidate.status === "Hired"
                            ? "bg-green-100 text-green-800"
                            : candidate.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills?.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {candidate.skills?.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            +{candidate.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(candidate.dateApplied)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleViewCandidate(candidate)}
                      >
                        <FiEye className="inline mr-1" /> View
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleDownloadCV(candidate)}
                      >
                        <FiDownload className="inline mr-1" /> CV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-lg shadow overflow-hidden border-t-4 ${
                candidate.status === "Shortlisted" ||
                candidate.status === "Hired"
                  ? "border-green-500"
                  : candidate.status === "Rejected"
                  ? "border-red-500"
                  : "border-blue-500"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {candidate.profilePhoto ? (
                          <img
                            src={
                              candidate.profilePhoto.startsWith("http")
                                ? candidate.profilePhoto
                                : `${process.env.NEXT_PUBLIC_API_URL}${candidate.profilePhoto}`
                            }
                            alt={candidate.name || "Profile"}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        ) : (
                          <FiUser className="text-gray-500 text-xl" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        candidate.matchScore > 85
                          ? "bg-green-100 text-green-800"
                          : candidate.matchScore > 70
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {candidate.matchScore}% match
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <FiBriefcase className="text-gray-400 mr-2" />
                    <span>
                      {candidate.experience?.length || 0} position(s) •{" "}
                      {candidate.location}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FiBook className="text-gray-400 mr-2" />
                    <span>
                      {candidate.education?.[0]?.degree ||
                        "Education not specified"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span>Applied {formatDate(candidate.dateApplied)}</span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Top Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills?.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => handleSelectCandidate(candidate.id)}
                    className={`px-3 py-1 text-sm rounded-md flex items-center ${
                      selectedCandidates.includes(candidate.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selectedCandidates.includes(candidate.id) ? (
                      <FiCheck className="mr-1" />
                    ) : (
                      <FiCheck className="mr-1 opacity-0" />
                    )}
                    Select
                  </button>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => handleViewCandidate(candidate)}
                    >
                      <FiEye className="inline mr-1" /> View
                    </button>

                    <button
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => handleDownloadCV(candidate)}
                    >
                      <FiDownload className="inline mr-1" /> CV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredCandidates.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredCandidates.length} of {candidates.length}{" "}
            candidates
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
