const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Create application
router.post('/', async(req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all applications
router.get('/', async(req, res) => {
    const applications = await Application.find();
    res.json(applications);
});

// Add endpoint to get total unique candidates
router.get('/unique-candidates', async(req, res) => {
    try {
        const uniqueCandidates = await Application.distinct('userId');
        res.json({ totalUniqueCandidates: uniqueCandidates.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get application by ID
router.get('/:id', async(req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ error: 'Application not found' });
        res.json(application);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update application by ID
router.put('/:id', async(req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!application) return res.status(404).json({ error: 'Application not found' });
        res.json(application);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete application by ID
router.delete('/:id', async(req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) return res.status(404).json({ error: 'Application not found' });
        res.json({ message: 'Application deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /applications/user/:userId
router.get('/user/:userId', async(req, res) => {
    try {
        const applications = await Application.find({ userId: req.params.userId });
        res.json(applications);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /applications/:id/status - Update application status
router.patch('/:id/status', async(req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update application status' });
    }
});

module.exports = router;