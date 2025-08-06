"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { 
  FiUser, FiMail, FiLock, FiCamera, FiSave, FiEdit, 
  FiSettings, FiShield, FiActivity, FiCalendar, 
  FiKey, FiUpload, FiCheckCircle, FiXCircle, FiLogOut,
  FiChevronRight, FiAlertCircle, FiClock, FiGlobe
} from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProfile = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePhoto: '',
    lastLogin: '',
    accountCreated: '',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)'
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    suspiciousActivityDetection: true
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileUpload, setFileUpload] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setProfile({
          ...data,
          lastLogin: new Date(data.lastLogin).toLocaleString(),
          accountCreated: new Date(data.createdAt).toLocaleDateString()
        });

        // Mock activity logs
        setActivityLogs([
          {
            id: 1,
            type: 'profile_update',
            title: 'Profile updated',
            description: 'You updated your profile information',
            date: new Date().toISOString(),
            icon: <FiUser />,
            color: 'blue'
          },
          {
            id: 2,
            type: 'security_change',
            title: 'Security settings changed',
            description: 'You modified your security preferences',
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            icon: <FiShield />,
            color: 'green'
          },
          {
            id: 3,
            type: 'login',
            title: 'Successful login',
            description: 'You logged in from a new device',
            date: data.lastLogin,
            icon: <FiGlobe />,
            color: 'purple'
          },
          {
            id: 4,
            type: 'failed_login',
            title: 'Failed login attempt',
            description: 'Someone tried to access your account',
            date: new Date(Date.now() - 86400000 * 3).toISOString(),
            icon: <FiAlertCircle />,
            color: 'red'
          }
        ]);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityToggle = (setting) => {
    setSecurity(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setFileUpload(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const uploadProfilePhoto = async () => {
    if (!fileUpload) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePhoto', fileUpload);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setProfile(prev => ({ ...prev, profilePhoto: data.profilePhoto }));
      toast.success('Profile photo updated successfully!');
      setFileUpload(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email
        })
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      const data = await response.json();
      setProfile(prev => ({ ...prev, ...data }));
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new
        })
      });
      
      if (!response.ok) throw new Error('Password update failed');
      
      toast.success('Password updated successfully!');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></motion.div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="flex flex-col lg:flex-row gap-8 pt-10">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-8">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4 group">
                <div className="relative h-32 w-32 rounded-full overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600">
                      <FiUser size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="p-2 rounded-full bg-white bg-opacity-80 cursor-pointer hover:bg-opacity-100 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <FiCamera className="text-gray-700" />
                    </label>
                  </div>
                </div>
                
                {fileUpload && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex gap-2"
                  >
                    <button
                      onClick={uploadProfilePhoto}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center transition-colors"
                      disabled={loading}
                    >
                      <FiUpload className="mr-1" /> {loading ? 'Uploading...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setFileUpload(null);
                        setPreviewImage('');
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 flex items-center transition-colors"
                    >
                      <FiXCircle className="mr-1" /> Cancel
                    </button>
                  </motion.div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 text-center">{profile.name}</h2>
              <p className="text-gray-600 text-sm">Administrator</p>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <FiClock className="mr-1" />
                <span>Last active: {formatDate(profile.lastLogin)}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiUser className="mr-3 text-lg" /> 
                <span>Profile</span>
                <FiChevronRight className="ml-auto" />
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors cursor-pointer ${
                  activeTab === 'security' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiShield className="mr-3 text-lg" /> 
                <span>Security</span>
                <FiChevronRight className="ml-auto" />
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors cursor-pointer ${
                  activeTab === 'activity' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiActivity className="mr-3 text-lg" /> 
                <span>Activity</span>
                <FiChevronRight className="ml-auto" />
              </button>
            </div>
            
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-full mt-6 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer"
            >
              <FiLogOut className="mr-2" /> Sign Out
            </button>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FiUser className="mr-2 text-blue-600" /> Profile Information
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal information and account settings</p>
                  </div>
                  
                  <div className="p-6">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                              editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                              editMode ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={profile.location}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                          <input
                            type="text"
                            value={profile.timezone}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Member since:</span> {profile.accountCreated}
                          </p>
                        </div>
                        
                        {editMode ? (
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setEditMode(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md hover:shadow-lg cursor-pointer"
                              disabled={loading}
                            >
                              <FiSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md hover:shadow-lg cursor-pointer"
                          >
                            <FiEdit className="mr-2" /> Edit Profile
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FiKey className="mr-2 text-blue-600" /> Change Password
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Update your account password for enhanced security</p>
                    </div>
                    
                    <div className="p-6">
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                              type="password"
                              name="current"
                              value={password.current}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                              type="password"
                              name="new"
                              value={password.new}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with at least one number and special character</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              name="confirm"
                              value={password.confirm}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md hover:shadow-lg cursor-pointer"
                            disabled={loading}
                          >
                            {loading ? 'Updating...' : (
                              <>
                                <FiCheckCircle className="mr-2" /> Update Password
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FiShield className="mr-2 text-blue-600" /> Security Settings
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Configure your account security preferences</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                              <FiShield />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSecurityToggle('twoFactorEnabled')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                              <FiAlertCircle />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Login Alerts</h4>
                              <p className="text-sm text-gray-500">Get notified for new logins</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSecurityToggle('loginAlerts')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              security.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                              <FiActivity />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Suspicious Activity Detection</h4>
                              <p className="text-sm text-gray-500">Monitor for unusual account behavior</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSecurityToggle('suspiciousActivityDetection')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              security.suspiciousActivityDetection ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                security.suspiciousActivityDetection ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FiActivity className="mr-2 text-blue-600" /> Recent Activity
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">View your account activity and access history</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {activityLogs.map((log) => (
                        <motion.div 
                          key={log.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-start p-4 rounded-lg border ${
                            log.type === 'failed_login' 
                              ? 'bg-red-50 border-red-100' 
                              : 'bg-gray-50 border-gray-100'
                          }`}
                        >
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${
                            log.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            log.color === 'green' ? 'bg-green-100 text-green-600' :
                            log.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            'bg-red-100 text-red-600'
                          } flex items-center justify-center mr-4`}>
                            {log.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{log.title}</h4>
                            <p className="text-sm text-gray-600">{log.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(log.date)}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center mx-auto">
                        View all activity <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;