"use client";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiDownload,
  FiFile,
  FiEdit2,
  FiPlus,
  FiX,
  FiSave,
  FiEye,
} from "react-icons/fi";
import { FaRegBuilding, FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../components/AuthProvider";

export default function JobSeekerProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePhoto: "",
    profile: {
      basicInfo: {},
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      socialLinks: {},
      resume: {},
      preferences: {},
      savedJobs: [],
      applications: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [resume, setResume] = useState(null);
  const [activeEditSection, setActiveEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const { user, token, login } = useAuth();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, token]);

  // Handle file upload
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmitResume = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name); // Append name first
      formData.append("resume", resume);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload resume");
      const updatedProfile = await res.json();
      setUserData(updatedProfile);
      setResume(null);
      setActiveEditSection(null);
    } catch (error) {
      console.error("Resume upload failed", error);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePhoto", file);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile-photo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (res.ok) {
      const updatedUser = await res.json();
      setUserData(updatedUser);
      setFormData((prev) => ({
        ...prev,
        profilePhoto: updatedUser.profilePhoto,
      }));
      // Update AuthProvider context and localStorage
      login(updatedUser, token);
    }
  };

  // Edit section handlers
  const startEditing = (section, data = {}) => {
    if (!editMode) return;

    if (section === "basicInfo") {
      setFormData({
        ...userData.profile.basicInfo,
        name: userData.name,
        email: userData.email,
        profilePhoto: userData.profilePhoto,
      });
    } else {
      setFormData(data);
    }
    setActiveEditSection(section);
  };

  const cancelEditing = () => {
    setActiveEditSection(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveSection = async (section) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`;
      const method = "PATCH";
      let updatedUser = { ...userData };

      if (section === "basicInfo") {
        updatedUser = {
          ...userData,
          name: formData.name || userData.name,
          email: formData.email || userData.email,
          profilePhoto: formData.profilePhoto || userData.profilePhoto,
          profile: {
            ...userData.profile,
            basicInfo: {
              ...userData.profile.basicInfo,
              ...formData,
            },
            socialLinks: {
              ...userData.profile.socialLinks,
              portfolio:
                formData.portfolio || 
                userData.profile.socialLinks?.portfolio ||
                "",
              linkedin:
                formData.linkedin ||
                userData.profile.socialLinks?.linkedin ||
                "",
              github:
                formData.github || userData.profile.socialLinks?.github || "",
            },
          },
        };
      } else if (section === "experience") {
        let updatedExp = [...userData.profile.experience];
        if (formData.idx !== undefined) {
          updatedExp[formData.idx] = { ...formData };
        } else {
          updatedExp.push({ ...formData });
        }
        updatedUser = {
          ...userData,
          profile: {
            ...userData.profile,
            experience: updatedExp,
          },
        };
      } else if (section === "skills") {
        let updatedSkills = [...userData.profile.skills];
        if (formData.idx !== undefined) {
          updatedSkills[formData.idx] = {
            name: formData.name,
            level: formData.level,
          };
        } else {
          updatedSkills.push({ name: formData.name, level: formData.level });
        }
        updatedUser = {
          ...userData,
          profile: {
            ...userData.profile,
            skills: updatedSkills,
          },
        };
      } else if (section === "education") {
        let updatedEdu = [...userData.profile.education];
        if (formData.idx !== undefined) {
          updatedEdu[formData.idx] = { ...formData };
        } else {
          updatedEdu.push({ ...formData });
        }
        updatedUser = {
          ...userData,
          profile: {
            ...userData.profile,
            education: updatedEdu,
          },
        };
      } else if (section === "certifications") {
        let updatedCerts = [...userData.profile.certifications];
        if (formData.idx !== undefined) {
          updatedCerts[formData.idx] = { ...formData };
        } else {
          updatedCerts.push({ ...formData });
        }
        updatedUser = {
          ...userData,
          profile: {
            ...userData.profile,
            certifications: updatedCerts,
          },
        };
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setUserData(data);
      cancelEditing();
      // Update AuthProvider context and localStorage
      login(data, token);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDeleteItem = async (section, idx) => {
    let updatedUser = { ...userData };
    if (section === "skills") {
      const updatedSkills = userData.profile.skills.filter((_, i) => i !== idx);
      updatedUser.profile.skills = updatedSkills;
    } else if (section === "experience") {
      const updatedExp = userData.profile.experience.filter(
        (_, i) => i !== idx
      );
      updatedUser.profile.experience = updatedExp;
    } else if (section === "education") {
      const updatedEdu = userData.profile.education.filter((_, i) => i !== idx);
      updatedUser.profile.education = updatedEdu;
    } else if (section === "certifications") {
      const updatedCerts = userData.profile.certifications.filter(
        (_, i) => i !== idx
      );
      updatedUser.profile.certifications = updatedCerts;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (res.ok) {
      const data = await res.json();
      setUserData(data);
    }
  };

  const calculateCompletion = () => {
    const totalFields = 10;
    let completedFields = 0;

    if (userData?.name) completedFields++;
    if (userData?.email) completedFields++;
    if (userData?.profilePhoto) completedFields++;
    if (userData?.profile?.basicInfo?.headline) completedFields++;
    if (userData?.profile?.experience?.length) completedFields++;
    if (userData?.profile?.education?.length) completedFields++;
    if (userData?.profile?.skills?.length) completedFields++;
    if (userData?.profile?.resume?.url) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            {editMode ? (
              <>
                <FiEye className="mr-1" /> Save
              </>
            ) : (
              <>
                <FiEdit2 className="mr-1" /> Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Completion Meter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Profile Strength</h3>
          <span className="text-blue-600 font-semibold">
            {calculateCompletion()}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${calculateCompletion()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {calculateCompletion() < 50
            ? "Complete more sections to increase visibility to recruiters"
            : calculateCompletion() < 80
            ? "Good progress! Add more details to maximize visibility"
            : "Great job! Your profile is highly visible to recruiters"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>
                {editMode && (
                  <button
                    onClick={() =>
                      startEditing(
                        "basicInfo",
                        userData?.profile?.basicInfo || {}
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit Basic Information"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "basicInfo" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo
                    </label>
                    <div className="flex items-center">
                      <img
                        src={
                          formData.profilePhoto ||
                          userData?.profilePhoto
                            ? `${process.env.NEXT_PUBLIC_API_URL}${userData.profilePhoto}`
                            : "/default-profile.jpg" ||
                          "/default-profile.jpg"
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mr-4"
                      />
                      <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                        />
                        Change Photo
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio
                    </label>
                    <input
                      type="text"
                      name="portfolio"
                      value={formData.portfolio || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Portfolio URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <input
                      type="text"
                      name="github"
                      value={formData.github || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="GitHub URL"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveSection("basicInfo")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center mb-6">
                    <img
                      src={
                        userData?.profilePhoto
                          ? `${process.env.NEXT_PUBLIC_API_URL}${userData.profilePhoto}`
                          : "/default-profile.jpg"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow mb-4"
                    />
                    <h2 className="text-xl font-bold text-gray-900">
                      {userData?.name || "Your Name"}
                    </h2>
                    <p className="text-blue-600 mt-1">
                      {userData?.profile?.basicInfo?.headline ||
                        "Your Professional Headline"}
                    </p>
                    {userData?.profile?.basicInfo?.location && (
                      <p className="text-gray-500 mt-1 flex items-center">
                        <FiMapPin className="mr-1" />{" "}
                        {userData.profile.basicInfo.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {userData?.email && (
                      <div className="flex items-start">
                        <FiMail className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Email
                          </h4>
                          <p className="text-gray-900">{userData.email}</p>
                        </div>
                      </div>
                    )}

                    {userData?.profile?.basicInfo?.phone && (
                      <div className="flex items-start">
                        <FiPhone className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Phone
                          </h4>
                          <p className="text-gray-900">
                            {userData.profile.basicInfo.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {userData?.profile?.socialLinks?.portfolio && (
                      <div className="flex items-start">
                        <FiGlobe className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Portfolio
                          </h4>
                          <a
                            href={`https://${userData.profile.socialLinks.portfolio}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {userData.profile.socialLinks.portfolio}
                          </a>
                        </div>
                      </div>
                    )}

                    {userData?.profile?.socialLinks?.linkedin && (
                      <div className="flex items-start">
                        <FiLinkedin className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            LinkedIn
                          </h4>
                          <a
                            href={`https://${userData.profile.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {userData.profile.socialLinks.linkedin}
                          </a>
                        </div>
                      </div>
                    )}

                    {userData?.profile?.socialLinks?.github && (
                      <div className="flex items-start">
                        <FiGithub className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            GitHub
                          </h4>
                          <a
                            href={`https://${userData.profile.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {userData.profile.socialLinks.github}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                {editMode && (
                  <button
                    onClick={() => startEditing("skills")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit Skills"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "skills" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. JavaScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proficiency Level
                    </label>
                    <select
                      name="level"
                      value={formData.level || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveSection("skills")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData?.profile?.skills?.length > 0 ? (
                    userData.profile.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {skill.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {skill.level}
                          </span>
                        </div>
                        {editMode && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                startEditing("skills", { ...skill, idx })
                              }
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem("skills", idx)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                {editMode && (
                  <button
                    onClick={() =>
                      startEditing("about", {
                        summary: userData?.profile?.basicInfo?.summary || "",
                      })
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit About"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "about" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary || ""}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell employers about yourself, your skills, and your experience..."
                  />
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveSection("basicInfo")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">
                  {userData?.profile?.basicInfo?.summary ||
                    "Add a professional summary to highlight your experience and skills."}
                </p>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
                {editMode && (
                  <button
                    onClick={() =>
                      startEditing("resume", userData?.profile?.resume || {})
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit Resume"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "resume" ? (
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  {resume && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FiFile className="text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{resume.name}</p>
                            <p className="text-sm text-gray-500">
                              {(resume.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={cancelEditing}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FiX />
                          </button>
                          <button
                            onClick={handleSubmitResume}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : userData?.profile?.resume?.url ? (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FiFile className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">
                        {userData.profile.resume.url.split("/").pop()}
                      </p>
                      {userData.profile.resume.lastUpdated && (
                        <p className="text-sm text-gray-500">
                          Last updated:{" "}
                          {new Date(
                            userData.profile.resume.lastUpdated
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <a
                    href={userData.profile.resume.url + `?username=${encodeURIComponent(userData.name)}`}
                    download={`${userData.name}_resume.pdf`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiDownload className="mr-1" /> Download
                  </a>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                  <FiFile className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No resume uploaded
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your resume to apply for jobs quickly
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Work Experience
                </h3>
                {editMode && (
                  <button
                    onClick={() => startEditing("experience")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit Experience"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "experience" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Senior Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        name="startDate"
                        value={formData.startDate || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        name="endDate"
                        value={formData.endDate || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="currentJob"
                          name="currentJob"
                          checked={formData.currentJob || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              currentJob: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="currentJob"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          I currently work here
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveSection("experience")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Experience
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {userData?.profile?.experience?.length > 0 ? (
                    userData.profile.experience.map((exp, idx) => (
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
                          {editMode && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  startEditing("experience", { ...exp, idx })
                                }
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteItem("experience", idx)
                                }
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          )}
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
                      <p className="mt-1 text-sm text-gray-500">
                        Add your work history to showcase your professional
                        background
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Education
                </h3>
                {editMode && (
                  <button
                    onClick={() => startEditing("education")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit Education"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "education" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        name="field"
                        value={formData.field || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        name="endDate"
                        value={formData.endDate || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 2018"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveSection("education")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Education
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {userData?.profile?.education?.length > 0 ? (
                    userData.profile.education.map((edu, idx) => (
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
                          {editMode && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  startEditing("education", { ...edu, idx })
                                }
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteItem("education", idx)
                                }
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No education added
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add your education history to showcase your academic
                        background
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Certificates Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Certifications
                </h3>
                {editMode && (
                  <button
                    onClick={() => startEditing("certifications")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    title="Edit Certifications"
                  >
                    <FiEdit2 className="mr-1" />
                  </button>
                )}
              </div>

              {activeEditSection === "certifications" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. AWS Certified Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      value={formData.issuer || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="month"
                      name="issueDate"
                      value={formData.issueDate || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="month"
                      name="expirationDate"
                      value={formData.expirationDate || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveSection("certifications")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add Certification
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData?.profile?.certifications?.length > 0 ? (
                    userData.profile.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {cert.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {cert.issuer}
                          </span>
                        </div>
                        {editMode && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                startEditing("certifications", { ...cert, idx })
                              }
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteItem("certifications", idx)
                              }
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No certifications added yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
