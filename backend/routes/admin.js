
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Multer setup for profile photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/profile_photos');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });
// GET /admin/profile
router.get('/profile', async (req, res) => {
  try {
    // For demo, get first admin (role: 'admin')
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/profile
router.put('/profile', async (req, res) => {
  try {
    // For demo, update first admin (role: 'admin')
    const admin = await User.findOneAndUpdate(
      { role: 'admin' },
      { $set: { name: req.body.name, email: req.body.email } },
      { new: true }
    );
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/profile/photo
router.post('/profile/photo', upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // For demo, update first admin (role: 'admin')
    const photoPath = `/uploads/profile_photos/${req.file.filename}`;
    const admin = await User.findOneAndUpdate(
      { role: 'admin' },
      { $set: { profilePhoto: photoPath } },
      { new: true }
    );
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ profilePhoto: photoPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /admin/profile/password
router.patch('/profile/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // For demo, update first admin (role: 'admin')
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET /admin/stats
router.get('/stats', async(req, res) => {
    try {
        const [totalUsers, totalJobs, totalCompanies, activeJobs, pendingJobs, pendingCompanies] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Company.countDocuments(),
            Job.countDocuments({ status: 'active' }),
            Job.countDocuments({ status: 'pending' }),
            Company.countDocuments({ verified: false })
        ]);
        res.json({
            totalUsers,
            totalJobs,
            totalCompanies,
            activeJobs,
            pendingApprovals: pendingJobs + pendingCompanies
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /admin/users
router.get('/users', async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/users/:id/ban
router.patch('/users/:id/ban', async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/users/:id/activate
router.patch('/users/:id/activate', async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /admin/jobs
router.get('/jobs', async(req, res) => {
    try {
        const jobs = await Job.find().populate('company', 'name logo');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/jobs/:id/approve
router.patch('/jobs/:id/approve', async(req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/jobs/:id/reject
router.patch('/jobs/:id/reject', async(req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/jobs/:id/close
router.patch('/jobs/:id/close', async(req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /admin/companies
router.get('/companies', async(req, res) => {
    try {
        const companies = await Company.find().populate('jobs').populate('recruiters');
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/companies/:id/approve
router.patch('/companies/:id/approve', async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, { verified: true, status: 'active' }, { new: true });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/companies/:id/reject
router.patch('/companies/:id/reject', async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, { verified: false, status: 'rejected' }, { new: true });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/companies/:id/ban
router.patch('/companies/:id/ban', async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/companies/:id/activate
router.patch('/companies/:id/activate', async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/companies/:id/deactivate
router.patch('/companies/:id/deactivate', async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, { status: 'deactive' }, { new: true });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /admin/jobs/:id/activate
router.patch('/jobs/:id/activate', async(req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;