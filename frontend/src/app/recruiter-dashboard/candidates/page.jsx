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
import { useAuth } from "../../components/AuthProvider";

export default function AdvancedCandidateSearch() {
  const router = useRouter();
  const { user, token } = useAuth();
  // Handle View button for table and grid
  const handleViewCandidate = (candidate) => {
    if (candidate) {
      const id = candidate.id || candidate._id;
      if (id) {
        router.push(`/profile/${id}`);
      }
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
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showSkillsPopup, setShowSkillsPopup] = useState(false);

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
  // Only required filters: status, experience, education, skills
  const [filters, setFilters] = useState({
    status: "all",
    experience: "",
    education: "",
    skills: "",
  });

  // Fetch unique candidates for recruiter using useAuth context
  useEffect(() => {
    const fetchUniqueCandidates = async () => {
      setLoading(true);
      try {
        if (!user?._id || !token) {
          setLoading(false);
          return;
        }
        // First, get the count
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/unique-candidates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        // console.log("data : ", data);

        // If candidates array exists, try to fetch full user data for each
        if (Array.isArray(data.candidates) && data.candidates.length > 0) {
          // If the candidate object is missing key fields, fetch full user data
          const fullCandidates = await Promise.all(
            data.candidates.map(async (candidate) => {
              // If candidate has many fields, assume it's full user object
              if (
                candidate &&
                candidate._id &&
                Object.keys(candidate).length > 6
              ) {
                return candidate;
              }
              // Otherwise, fetch full user data
              const id = candidate._id || candidate.id || candidate.userId;
              if (!id) return candidate;
              try {
                const userRes = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (!userRes.ok) return candidate;
                const userData = await userRes.json();
                return { ...userData, ...candidate };
              } catch {
                return candidate;
              }
            })
          );
          setCandidates(fullCandidates);
          setFilteredCandidates(fullCandidates);
        } else if (data.count > 0) {
          // Fallback: fetch all applications for this recruiter
          const appsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/applications?recruiter=${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const appsData = await appsRes.json();
          // Extract unique candidates by userId
          const uniqueMap = new Map();
          appsData.forEach((app) => {
            const userObj = app.userId || {};
            const id = userObj._id || userObj.id || app.userId;
            if (!uniqueMap.has(id)) {
              uniqueMap.set(id, {
                ...userObj,
                id,
                status: app.status || "Applied",
                dateApplied: app.createdAt || null,
                matchScore: Math.floor(Math.random() * 30) + 70,
              });
            }
          });
          const uniqueCandidates = Array.from(uniqueMap.values());
          setCandidates(uniqueCandidates);
          setFilteredCandidates(uniqueCandidates);
        } else {
          setCandidates([]);
          setFilteredCandidates([]);
        }
      } catch (err) {
        setCandidates([]);
        setFilteredCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUniqueCandidates();
  }, [user, token]);

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

      // Only required filters
      return (
        matchesSearch &&
        matchesStatus &&
        matchesExperience &&
        matchesEducation &&
        matchesSkills
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
    if (!id) return; // Don't proceed if no ID
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
      setSelectedCandidates(
        filteredCandidates
          .map((c) => c._id || c.id)
          .filter((id) => id !== undefined) // Ensure we only include valid IDs
      );
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case "email": {
        try {
          // Get selected emails or all filtered candidates if none selected
          let emails = [];
          if (selectedCandidates.length > 0) {
            emails = filteredCandidates
              .filter((c) => selectedCandidates.includes(c._id || c.id))
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
      // case "download": {
      //   const selected = filteredCandidates.filter((c) =>
      //     selectedCandidates.includes(c._id || c.id)
      //   );
      //   if (selected.length === 0) {
      //     alert("No candidates selected for download.");
      //     return;
      //   }
      //   selected.forEach(async (candidate, idx) => {
      //     // Robust resume extraction (same as handleDownloadCV)
      //     let user =
      //       candidate.userId && typeof candidate.userId === "object"
      //         ? candidate.userId
      //         : undefined;
      //     let resumeUrl =
      //       candidate.profile?.resume?.url ||
      //       "";
      //     if (!resumeUrl) return;
      //     if (!resumeUrl.startsWith("http")) {
      //       resumeUrl = `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`;
      //     }
      //     try {
      //       const headers = {};
      //       if (token) {
      //         headers["Authorization"] = `Bearer ${token}`;
      //       }
      //       const response = await fetch(resumeUrl, { method: "GET", headers });
      //       if (!response.ok) throw new Error("Failed to download resume");
      //       const blob = await response.blob();
      //       const url = window.URL.createObjectURL(blob);
      //       const a = document.createElement("a");
      //       a.href = url;
      //       // Use candidate name or fallback for filename
      //       let filename =
      //         resumeUrl.split("/").pop() || `resume_${idx + 1}.pdf`;
      //       if (user?.name) {
      //         filename = user.name.replace(/\s+/g, "_") + "_resume.pdf";
      //       } else if (candidate.name) {
      //         filename = candidate.name.replace(/\s+/g, "_") + "_resume.pdf";
      //       } else if (candidate.id || candidate._id) {
      //         filename = `resume_${candidate.id || candidate._id}.pdf`;
      //       }
      //       a.download = filename;
      //       document.body.appendChild(a);
      //       a.click();
      //       a.remove();
      //       window.URL.revokeObjectURL(url);
      //     } catch (err) {
      //       // Optionally show error for this candidate
      //     }
      //   });
      //   break;
      // }
      case "download": {
        const selected = filteredCandidates.filter((c) =>
          selectedCandidates.length > 0
            ? selectedCandidates.includes(c._id || c.id)
            : true
        );

        if (selected.length === 0) {
          alert("No candidates selected for download.");
          return;
        }

        // Check which candidates have resumes
        const candidatesWithResumes = [];
        const candidatesWithoutResumes = [];

        selected.forEach((candidate) => {
          const user =
            candidate.userId && typeof candidate.userId === "object"
              ? candidate.userId
              : undefined;
          const resumeUrl = candidate.profile?.resume?.url || "";

          if (resumeUrl) {
            candidatesWithResumes.push({
              candidate,
              user,
              resumeUrl,
            });
          } else {
            candidatesWithoutResumes.push(candidate);
          }
        });

        // Prepare alert message
        let alertMessage;
        if (candidatesWithResumes.length === 0) {
          const namesWithoutResumes = candidatesWithoutResumes
            .map((c) => c.name || c.email || "Unknown candidate")
            .join(", ");

          alertMessage =
            `${candidatesWithoutResumes.length} candidate(s) don't have CVs uploaded:\n\n` +
            `${namesWithoutResumes}\n\n` +
            `No CVs available for download.`;
          alert(alertMessage);
          return; // Exit early since there's nothing to download
        } else if (candidatesWithoutResumes.length > 0) {
          const namesWithoutResumes = candidatesWithoutResumes
            .map((c) => c.name || c.email || "Unknown candidate")
            .join(", ");

          alertMessage =
            `${candidatesWithoutResumes.length} candidate(s) don't have CVs uploaded:\n\n` +
            `${namesWithoutResumes}\n\n` +
            `Proceeding to download ${candidatesWithResumes.length} available CV(s)...`;
        } else {
          alertMessage = `Proceeding to download ${candidatesWithResumes.length} candidate CV(s)...`;
        }

        // Show alert
        alert(alertMessage);

        // Download available resumes
        candidatesWithResumes.forEach(
          async ({ candidate, user, resumeUrl }, idx) => {
            try {
              if (!resumeUrl.startsWith("http")) {
                resumeUrl = `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`;
              }

              const headers = {};
              if (token) {
                headers["Authorization"] = `Bearer ${token}`;
              }

              const response = await fetch(resumeUrl, {
                method: "GET",
                headers,
              });
              if (!response.ok) throw new Error("Failed to download resume");

              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;

              let filename =
                resumeUrl.split("/").pop() || `resume_${idx + 1}.pdf`;
              if (user?.name) {
                filename = user.name.replace(/\s+/g, "_") + "_resume.pdf";
              } else if (candidate.name) {
                filename = candidate.name.replace(/\s+/g, "_") + "_resume.pdf";
              } else if (candidate.id || candidate._id) {
                filename = `resume_${candidate.id || candidate._id}.pdf`;
              }

              a.download = filename;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error(
                `Error downloading CV for candidate ${
                  candidate._id || candidate.id
                }`,
                err
              );
            }
          }
        );

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
    // Prefer userId.profile.resumeUrl, then userId.resume, then candidate.resume, then candidate.profile.resumeUrl
    let user =
      candidate.userId && typeof candidate.userId === "object"
        ? candidate.userId
        : undefined;
    let resumeUrl =
      // user?.profile?.resumeUrl ||
      // user?.resume ||
      // candidate?.resume ||
      // candidate?.profile?.resumeUrl ||
      candidate?.profile?.resume?.url ||
      // candidate?.profile?.resume ||
      "";
    // Debug log: show candidate and resolved resumeUrl
    // console.log("[DownloadCV] candidate:", candidate);
    // console.log("[DownloadCV] resolved resumeUrl:", resumeUrl);
    if (!resumeUrl) {
      alert("No resume available for this candidate.");
      return;
    }
    try {
      // If resume is a relative path, prepend API URL
      if (!resumeUrl.startsWith("http")) {
        resumeUrl = `${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`;
      }
      // console.log("[DownloadCV] final download URL:", resumeUrl);
      // Fetch the file as blob, include Authorization header if token exists
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(resumeUrl, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Failed to download resume");
      const blob = await response.blob();
      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Try to get filename from user or candidate name, fallback to id
      let filename = resumeUrl.split("/").pop() || "resume.pdf";
      if (user?.name) {
        filename = user.name.replace(/\s+/g, "_") + "_resume.pdf";
      } else if (candidate.name) {
        filename = candidate.name.replace(/\s+/g, "_") + "_resume.pdf";
      } else if (candidate.id || candidate._id) {
        filename = `resume_${candidate.id || candidate._id}.pdf`;
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading resume.");
      console.error("[DownloadCV] Error:", err);
    }
  };

  const SkillsPopup = () => {
    if (!showSkillsPopup || !selectedCandidate) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-100">
        {/* Transparent overlay with click-to-close */}
        <div
          className="absolute inset-0 bg-transperent bg-opacity-30"
          onClick={() => setShowSkillsPopup(false)}
        />

        {/* Transparent popup container with border */}
        <div className="relative bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg w-96 border-2 border-gray-300 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">All Skills</h3>
            <button
              onClick={() => setShowSkillsPopup(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto pr-2">
            <div className="flex flex-wrap gap-2">
              {selectedCandidate.profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm rounded-full bg-blue-100 bg-opacity-70 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14 bg-gray-50 min-h-screen">
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
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center cursor-pointer"
            >
              <FiMail className="mr-2" /> Email
            </button>
            <button
              onClick={() => handleBulkAction("download")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center cursor-pointer"
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
                        selectedCandidates.length > 0 &&
                        selectedCandidates.length === filteredCandidates.length
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
                    Experience
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Highest Qualification
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => {
                  // If candidate.userId is present, use its fields for experience, education, skills, profilePhoto
                  const user =
                    candidate.userId && typeof candidate.userId === "object"
                      ? candidate.userId
                      : candidate;
                  return (
                    <tr
                      key={candidate._id || candidate.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(
                            candidate._id || candidate.id
                          )}
                          onChange={() =>
                            handleSelectCandidate(candidate._id || candidate.id)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.profilePhoto ? (
                              <img
                                src={
                                  user.profilePhoto.startsWith("http")
                                    ? user.profilePhoto
                                    : `${process.env.NEXT_PUBLIC_API_URL}${user.profilePhoto}`
                                }
                                alt={user.name || "Profile"}
                                className="h-10 w-10 object-cover rounded-full"
                              />
                            ) : (
                              <FiUser className="text-gray-500 text-xl" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "No Name"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email || "No Email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Experience: show total years or summary */}
                        {Array.isArray(user.profile.experience) &&
                        user.profile.experience.length > 0 ? (
                          `${user.profile.experience.reduce(
                            (sum, exp) => sum + (exp.years || 0),
                            0
                          )} yrs 
                            (${
                              user.profile.experience[0].title ||
                              user.profile.experience[0].role ||
                              ""
                            })`
                        ) : (
                          <span className="px-2 py-1 text-xs text-gray-500 italic">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Highest Qualification: show first or highest degree */}
                        {Array.isArray(user.profile.education) &&
                        user.profile.education.length > 0 ? (
                          `${user.profile.education[0].degree || ""} ${
                            user.profile.education[0].field
                              ? `- ${user.profile.education[0].field}`
                              : ""
                          }`
                        ) : (
                          <span className="px-2 py-1 text-xs text-gray-500 italic">
                            N/A
                          </span>
                        )}
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
                          {user.profile.skills?.length > 0 ? (
                            <>
                              {user.profile.skills
                                .slice(0, 3)
                                .map((skill, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700"
                                  >
                                    {skill.name}
                                  </span>
                                ))}
                              {user.profile.skills.length > 3 && (
                                // <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                //   +{user.profile.skills.length - 3} more
                                // </span>
                                <button
                                  onClick={() => {
                                    setSelectedCandidate(candidate);
                                    setShowSkillsPopup(true);
                                  }}
                                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                                >
                                  +{candidate.profile.skills.length - 3} more
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="px-2 py-1 text-xs text-gray-400 italic">
                              N/A
                            </span>
                          )}
                        </div>
                        <SkillsPopup />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                          onClick={() => handleViewCandidate(candidate)}
                        >
                          <FiEye className="inline mr-1" /> View
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 cursor-pointer"
                          onClick={() => handleDownloadCV(candidate)}
                        >
                          <FiDownload className="inline mr-1" /> CV
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate._id || candidate.id}
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
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <FiBriefcase className="text-gray-400 mr-2" />
                    <span>
                      {/* Experience: show total years or summary */}
                      {Array.isArray(candidate.profile.experience) &&
                      candidate.profile.experience.length > 0 ? (
                        `${candidate.profile.experience.reduce(
                          (sum, exp) => sum + (exp.years || 0),
                          0
                        )} yrs (${
                          candidate.profile.experience[0].title ||
                          candidate.profile.experience[0].role ||
                          ""
                        })`
                      ) : (
                        <span className="px-2 py-1 text-xs text-gray-500 italic">
                          N/A
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <FiBook className="text-gray-400 mr-2" />
                    <span>
                      {/* Highest Qualification: show first or highest degree */}
                      {Array.isArray(candidate.profile.education) &&
                      candidate.profile.education.length > 0 ? (
                        `${candidate.profile.education[0].degree || ""} ${
                          candidate.profile.education[0].field
                            ? `- ${candidate.profile.education[0].field}`
                            : ""
                        }`
                      ) : (
                        <span className="px-2 py-1 text-xs text-gray-500 italic">
                          N/A
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Top Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.profile.skills?.length > 0 ? (
                        <>
                          {candidate.profile.skills
                            .slice(0, 3)
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700"
                              >
                                {skill.name}
                              </span>
                            ))}
                          {candidate.profile.skills.length > 3 && (
                            <button
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowSkillsPopup(true);
                              }}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                            >
                              +{candidate.profile.skills.length - 3} more
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="px-2 py-1 text-xs text-gray-500 italic">
                          N/A
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <SkillsPopup />

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() =>
                      handleSelectCandidate(candidate._id || candidate.id)
                    }
                    className={`px-3 py-1 text-sm rounded-md flex items-center cursor-pointer ${
                      selectedCandidates.includes(candidate._id || candidate.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selectedCandidates.includes(
                      candidate._id || candidate.id
                    ) ? (
                      <FiCheck className="mr-1" />
                    ) : (
                      ""
                    )}
                    Select
                  </button>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewCandidate(candidate)}
                    >
                      <FiEye className="inline mr-1" /> View
                    </button>

                    <button
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
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
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 cursor-pointer">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
