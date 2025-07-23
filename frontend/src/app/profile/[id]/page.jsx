"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGlobe, 
  FiFile,
  FiDownload,
  FiBriefcase,
  FiCalendar,
  FiArrowLeft
} from "react-icons/fi";
import { 
  FaLinkedin, 
  FaGithub, 
  FaRegBuilding,
  FaGraduationCap
} from "react-icons/fa";
import { useAuth } from "../../components/AuthProvider";

export default function JobSeekerProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const { token } = useAuth();
  
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
      if (res.ok) {
        setUser(await res.json());
      }
    }
    fetchUser();
  }, [id]);

  if (!user) return <div className="p-8">Loading...</div>;

  // Helper to get full resume URL
  const getResumeUrl = (cacheBust = false) => {
    if (!user?.profile?.resume?.url) return '';
    const baseUrl = user.profile.resume.url.startsWith('http')
      ? user.profile.resume.url
      : `${process.env.NEXT_PUBLIC_API_URL}${user.profile.resume.url}`;
    
    if (cacheBust) {
      return `${baseUrl}?t=${new Date().getTime()}`;
    }
    return baseUrl;
  };

  // Download handler
  const handleDownloadResume = async () => {
    try {
      const resumeUrl = getResumeUrl();
      const response = await fetch(resumeUrl, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch resume");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      // Generate filename: e.g., John_Doe_resume.pdf
      const name =
        user.profile?.basicInfo?.name ||
        user.name ||
        "resume";
      const safeName = name.trim().replace(/\s+/g, "_");
      const filename = `${safeName}_resume.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download resume.");
    }
  };

  // Back button handler
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
     
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
          onClick={handleBack}
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Completion Meter */}
     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>

              <div className="flex flex-col items-center text-center mb-6">
                <img
                  src={
                    user?.profilePhoto
                      ? `${process.env.NEXT_PUBLIC_API_URL}${user.profilePhoto}`
                      : "/default-profile.jpg"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow mb-4"
                />
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-blue-600 mt-1">
                  {user?.profile?.basicInfo?.headline ||
                    "Professional Headline"}
                </p>
                {user?.profile?.basicInfo?.location && (
                  <p className="text-gray-500 mt-1 flex items-center">
                    <FiMapPin className="mr-1" />{" "}
                    {user.profile.basicInfo.location}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {user?.email && (
                  <div className="flex items-start">
                    <FiMail className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Email
                      </h4>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>
                )}

                {user?.profile?.basicInfo?.phone && (
                  <div className="flex items-start">
                    <FiPhone className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Phone
                      </h4>
                      <p className="text-gray-900">
                        {user.profile.basicInfo.phone}
                      </p>
                    </div>
                  </div>
                )}

                {user?.profile?.socialLinks?.portfolio && (
                  <div className="flex items-start">
                    <FiGlobe className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Portfolio
                      </h4>
                      <a
                        href={`https://${user.profile.socialLinks.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.profile.socialLinks.portfolio}
                      </a>
                    </div>
                  </div>
                )}

                {user?.profile?.socialLinks?.linkedin && (
                  <div className="flex items-start">
                    <FaLinkedin className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        LinkedIn
                      </h4>
                      <a
                        href={`https://${user.profile.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.profile.socialLinks.linkedin}
                      </a>
                    </div>
                  </div>
                )}

                {user?.profile?.socialLinks?.github && (
                  <div className="flex items-start">
                    <FaGithub className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        GitHub
                      </h4>
                      <a
                        href={`https://${user.profile.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.profile.socialLinks.github}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="space-y-3">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700">
                {user?.profile?.basicInfo?.summary ||
                  "No professional summary provided."}
              </p>
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Resume</h3>
                {user.profile?.resume?.url ? (
                  <>
                    {!showPdf ? (
                      <div className="flex gap-4 items-center">
                        <button
                          onClick={() => setShowPdf(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          View Resume
                        </button>
                        <button
                          onClick={handleDownloadResume}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Download Resume
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => setShowPdf(false)}
                          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                          Back to Profile
                        </button>
                        <div className="w-full" style={{ height: "90vh" }}>
                          <iframe
                            src={getResumeUrl(true)} // Pass true to bust cache for viewing
                            title="Resume PDF"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No resume uploaded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Work Experience
              </h3>
              <div className="space-y-6">
                {user?.profile?.experience?.length > 0 ? (
                  user.profile.experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="border-l-2 border-blue-200 pl-4 mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {exp.title}
                          </h4>
                          <div className="flex justify-between flex-wrap gap-12">
                            <p className="text-gray-600 flex items-center">
                              <FaRegBuilding className="mr-1" />
                              {exp.company} • {exp.location}
                            </p>
                            <p className="text-gray-600">
                              {exp.startDate} to {exp.endDate}
                            </p>
                          </div>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="mt-2 text-gray-700">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No experience added
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Education
              </h3>
              <div className="space-y-6">
                {user?.profile?.education?.length > 0 ? (
                  user.profile.education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="border-l-2 border-blue-200 pl-4 mb-2"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {edu.degree}
                          </h4>
                          <p className="text-gray-600">
                            <FaGraduationCap className="inline mr-1" />{" "}
                            {edu.institution} - {edu.endDate}
                          </p>
                          {edu.field && (
                            <p className="text-sm text-gray-500">
                              {edu.field}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No education added
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Certifications
              </h3>
              <div className="space-y-3">
                {user?.profile?.certifications?.length > 0 ? (
                  user.profile.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {cert.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {cert.issuer}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No certifications added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}