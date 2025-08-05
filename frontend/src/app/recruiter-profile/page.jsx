"use client";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiEdit2,
  FiSave,
  FiEye,
  FiX,
  FiUpload,
  FiLink,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { FaLinkedin, FaIndustry, FaGlobeAmericas } from "react-icons/fa";
import { useAuth } from "../components/AuthProvider";

export default function RecruiterProfile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      // 1. Fetch recruiter (user) data
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await res.json();
      setProfile(userData);
      // 2. Fetch company data using company ObjectId from user
      if (userData.company) {
        try {
          const companyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${userData.company}`);
          if (companyRes.ok) {
            const companyData = await companyRes.json();
            setCompany(companyData);
          } else {
            setCompany(null); // Company not found
          }
        } catch {
          setCompany(null); // Network or other error
        }
      } else {
        setCompany(null); // No company set
      }
    };
    if (user && token) fetchProfile();
  }, [user, token]);

  const startEditing = (section) => {
    setActiveSection(section);
    if (section === 'company') {
      setFormData(company);
    } else {
      setFormData(profile);
    }
  };

  const cancelEditing = () => {
    setActiveSection(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (activeSection === 'company') {
      if (!company || !company._id) {
        // No company exists, create one
        const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ ...formData, recruiters: [user.id] })
        });
        const newCompany = await createRes.json();
        setCompany(newCompany);
        // Update recruiter to reference new company
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ company: newCompany._id })
        });
        setProfile(prev => ({ ...prev, company: newCompany._id }));
      } else {
        // PATCH company as before, and add user to recruiters if not present
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${company._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ ...formData, $addToSet: { recruiters: user.id } })
        });
        setCompany({ ...company, ...formData });
      }
    } else {
      // PATCH recruiter (user) - update recruiter object, name, and email
      // Ensure recruiter object structure is correct
      const recruiterPayload = {
        position: formData.position,
        phone: formData.phone,
        socialLinks: formData.socialLinks || {},
      };
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recruiter: recruiterPayload,
          name: formData.name,
          email: formData.email
        })
      });
      setProfile(prev => ({ ...prev, recruiter: recruiterPayload, name: formData.name, email: formData.email }));
    }
    cancelEditing();
  };

  // Helper to get full profile photo URL
  const getProfilePhotoUrl = (photo) => {
    if (!photo) return '/default-profile.jpg';
    return photo.startsWith('http') ? photo : `${process.env.NEXT_PUBLIC_API_URL}${photo}`;
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'photo' && user?.id) {
      // Upload profile photo as file
      const formData = new FormData();
      formData.append('profilePhoto', file);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile-photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(res => res.json())
        .then(updatedUser => {
          setProfile(updatedUser);
        });
    } else if (type === 'logo' && company?._id) {
      // Upload company logo as file
      const formData = new FormData();
      formData.append('logo', file);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${company._id}/logo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(res => res.json())
        .then(updatedCompany => {
          setCompany(updatedCompany);
        });
    }
  };

  // Helper to get full logo URL
  const getLogoUrl = (logo) => {
    if (!logo) return '/default-company.jpg';
    return logo.startsWith('http') ? logo : `${process.env.NEXT_PUBLIC_API_URL}${logo}`;
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <FiLoader className="animate-spin mr-2 text-2xl" />
        <span>Loading Profile data...</span>
      </div>
    );
  }
  if (!company) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <FiLoader className="animate-spin mr-2 text-2xl" />
        <span>Loading company data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow overflow-hidden">
              <img
                src={getLogoUrl(company.logo)}
                alt="Company Logo"
                className="w-full h-full object-fit"
              />
            </div>
            {company.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full">
                <FiCheckCircle className="h-4 w-4" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FaIndustry className="text-blue-500" /> {company.industry}
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin className="text-blue-500" /> {company.location}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`mt-4 md:mt-0 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
            editMode 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {editMode ? <FiEye className="h-4 w-4" /> : <FiEdit2 className="h-4 w-4" />}
          {editMode ? "View Mode" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow overflow-hidden">
                  <img
                    src={getProfilePhotoUrl(profile.profilePhoto)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-2 shadow-sm cursor-pointer hover:bg-gray-50">
                    <FiUpload className="h-4 w-4 text-gray-700" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, 'photo')}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              
              {activeSection === 'personal' ? (
                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      name="socialLinks.linkedin"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={e => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveChanges}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                  <p className="text-blue-600 font-medium">{profile.recruiter?.position}</p>
                  {editMode && (
                    <button
                      onClick={() => startEditing('personal')}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <FiEdit2 className="h-3 w-3" /> Edit Profile
                    </button>
                  )}
                  <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiMail className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700">{profile.recruiter?.phone}</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaLinkedin className="text-gray-500 flex-shrink-0" />
                  {profile.recruiter?.socialLinks?.linkedin ? (
                    <a
                      href={
                        profile.recruiter.socialLinks.linkedin.match(/^https?:\/\//)
                          ? profile.recruiter.socialLinks.linkedin
                          : `https://${profile.recruiter.socialLinks.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.recruiter.socialLinks.linkedin.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-gray-700">Not provided</span>
                  )}
                </div>
              </div>
                </>
              )}
             
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Company</h3>
              {editMode && !activeSection && (
                <button
                  onClick={() => startEditing('company')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 className="h-4 w-4 cursor-pointer" />
                </button>
              )}
            </div>
            
            {activeSection === 'company' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 overflow-hidden">
                      <img 
                        src={formData.logo} 
                        alt="Company Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      <FiUpload className="inline mr-1" /> Change
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
                    <input
                      type="text"
                      name="founded"
                      value={formData.founded || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                    <input
                      type="text"
                      name="employees"
                      value={formData.employees || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={saveChanges}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                    <img 
                      src={getLogoUrl(company.logo)} 
                      alt="Company Logo" 
                      className="w-full h-full object-fit"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{company.name}</h4>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  <p className="mb-3">{company.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaGlobeAmericas className="text-gray-500" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {company.website?.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-500" />
                      <span>Founded {company.founded}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-gray-500" />
                      <span>{company.employees} employees</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-500" />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Total Jobs Posted</span>
                    <span className="font-medium">{profile.stats?.totalJobs}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Active Jobs</span>
                    <span className="font-medium">{profile.stats?.activeJobs}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(profile.stats?.activeJobs / profile.stats?.totalJobs) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Successful Hires</span>
                    <span className="font-medium">{profile.stats?.hiresMade}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${profile.stats?.hireRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Average Response Time</span>
                    <span className="font-medium">{profile.stats?.responseTime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                  <div className="bg-blue-100 p-3 rounded-full mb-2">
                    <FiBriefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Post Job</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition">
                  <div className="bg-green-100 p-3 rounded-full mb-2">
                    <FiUsers className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">View Candidates</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition">
                  <div className="bg-purple-100 p-3 rounded-full mb-2">
                    <FiMail className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Messages</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition">
                  <div className="bg-yellow-100 p-3 rounded-full mb-2">
                    <FiLink className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Share Profile</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  type: "application",
                  title: "New application for Senior Frontend Developer",
                  candidate: "Michael Chen",
                  time: "2 hours ago",
                  read: false
                },
                {
                  id: 2,
                  type: "message",
                  title: "Message from candidate",
                  candidate: "Jessica Williams",
                  time: "5 hours ago",
                  read: true
                },
                {
                  id: 3,
                  type: "interview",
                  title: "Interview scheduled for DevOps Engineer",
                  candidate: "David Kim",
                  time: "1 day ago",
                  read: true
                },
                {
                  id: 4,
                  type: "hire",
                  title: "You hired a new candidate",
                  candidate: "Alex Morgan",
                  time: "3 days ago",
                  read: true
                }
              ].map(activity => (
                <div 
                  key={activity.id} 
                  className={`p-4 border rounded-lg ${activity.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{activity.candidate}</span> • {activity.time}
                      </p>
                    </div>
                    {!activity.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
              View all activity →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}