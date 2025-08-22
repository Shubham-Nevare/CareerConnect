const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/resumes/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create job
router.post('/', async(req, res) => {
    // console.log('POST /jobs req.body:', req.body); // Debug log
    try {
        const job = new Job(req.body);
        await job.save();
        // After saving the job, add its _id to the corresponding company's jobs array
        if (job.company) {
            await Company.findByIdAndUpdate(
                job.company, { $push: { jobs: job._id } }, { new: true }
            );
        }
        // Also add job._id to the recruiter's jobPosts array
        if (req.body.recruiterId) {
            await User.findByIdAndUpdate(
                req.body.recruiterId,
                { $push: { jobPosts: job._id } },
                { new: true }
            );
        }
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all jobs with pagination
router.get('/', async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Hardcode status to 'active' for this public-facing route
    query.status = 'active';

    if (req.query.search) {
        query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.location) {
        query.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.type) {
        query.type = req.query.type;
    }
    // Add experience filter if provided
    if (req.query.experience) {
        query.experience = req.query.experience;
    }
    // Add salary range filter if provided
    if (req.query.salary) {
        if (req.query.salary === 'below-3') {
            query.salary = { $lt: 3 }; // Below 3 LPA
        } else if (req.query.salary === '3-6') {
            query.salary = { $gte: 3, $lt: 6 }; // 3-6 LPA
        } else if (req.query.salary === '6-10') {
            query.salary = { $gte: 600000, $lt: 10 }; // 6-10 LPA
        } else if (req.query.salary === '10-plus') {
            query.salary = { $gte: 10 }; // 10+ LPA
        }
    }
    // Note: The frontend sends a 'status' param, but we are intentionally overriding it
    // on the backend for this specific route to ensure only 'active' jobs are shown.
    // The recruiter dashboard route handles other statuses for logged-in recruiters.

    const [jobs, total] = await Promise.all([
        Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('company', 'name logo industry website location employees experience description'),
        Job.countDocuments(query)
    ]);

    res.json({
        jobs,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

// Get jobs for the logged-in recruiter's company
router.get('/recruiter', async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Use `decoded.userId` which was set during token signing in auth.js
        const recruiter = await User.findById(decoded.userId);

        if (!recruiter || !recruiter.company) {
            return res.status(403).json({ error: 'Recruiter or company not found' });
        }

        const recruiterJobs = await Job.find({ company: recruiter.company })
            .populate('company', 'name logo industry website location employees experience description')
            .populate({
                path: 'applicants',
                populate: {
                    path: 'userId', // Correct path is 'userId' which refs 'User'
                    model: 'User',
                    select: 'name email profilePhoto'
                }
            });

        res.json(recruiterJobs);
    } catch (err) {
        // More detailed error logging for debugging
        console.error("Error fetching recruiter jobs:", err);
        res.status(400).json({ error: 'Failed to fetch jobs. ' + err.message });
    }
});


// Get job by ID
router.get('/:id', async(req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name logo industry website location employees experience');
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update job by ID
router.put('/:id', async(req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update job status by ID
router.patch('/:id/status', async(req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update job status' });
    }
});

// Delete job by ID
router.delete('/:id', async(req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get latest 2 jobs excluding a specific job
router.get('/latest/:excludeId', async(req, res) => {
    const { excludeId } = req.params;
    const latestJobs = await Job.find({ _id: { $ne: excludeId } })
        .sort({ createdAt: -1 })
        .limit(2)
        .populate('company', 'name logo industry website location employees experience');
    res.json(latestJobs);
});

// POST /jobs/:jobId/apply (with file upload)
router.post('/:jobId/apply', upload.single('resume'), async(req, res) => {
    try {
        const { userId, name, email } = req.body;
        if (!userId || !name || !email) {
            return res.status(400).json({ error: 'Missing required application fields.' });
        }
        const application = new Application({
            ...req.body,
            jobId: req.params.jobId,
            resume: req.file ? req.file.path : undefined,
        });
        await application.save();

        await Job.findByIdAndUpdate(
            req.params.jobId, { $push: { applicants: application._id } }
        );

        // Also push application._id to user's applications array
        await User.findByIdAndUpdate(
            userId, { $push: { applications: application._id } }
        );

        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;