const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '../uploads/profile_photos/') });
// Update Multer storage for resumes to save as firstname_lastname_resume.pdf
const resumeStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/resumes/'));
    },
    filename: function(req, file, cb) {
        let username = 'user';
        if (req.body && req.body.name) {
            // Split name into words, use first and last
            const words = req.body.name.trim().split(/\s+/);
            let first = words[0] || '';
            let last = words.length > 1 ? words[words.length - 1] : '';
            first = first.replace(/[^a-zA-Z0-9_]/g, '');
            last = last.replace(/[^a-zA-Z0-9_]/g, '');
            username = `${first}_${last}`;
        }
        cb(null, `${username}_resume.pdf`);
    }
});
const resumeUpload = multer({ storage: resumeStorage });

// Update Multer storage for profile photos to save with original extension
const profilePhotoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/profile_photos/'));
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const profilePhotoUpload = multer({ storage: profilePhotoStorage });

// Create user
router.post('/', async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
router.get('/', async(req, res) => {
    const users = await User.find();
    res.json(users);
});

// Get user by ID
router.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update user by ID
router.put('/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add PATCH route for partial updates
router.patch('/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Profile photo upload endpoint
router.post('/:id/profile-photo', profilePhotoUpload.single('profilePhoto'), async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { profilePhoto: `/uploads/profile_photos/${req.file.filename}` }, { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Resume upload endpoint
router.post('/:id/resume', resumeUpload.single('resume'), async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, {
                'profile.resume.url': `/uploads/resumes/${req.file.filename}`,
                'profile.resume.lastUpdated': new Date().toISOString(),
            }, { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user by ID
router.delete('/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;