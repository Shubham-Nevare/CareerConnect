const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const upload = multer({
    dest: path.join(__dirname, "../uploads/profile_photos/"),
});
// Update Multer storage for resumes to save as firstname_lastname_resume.pdf
const resumeStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/resumes/"));
    },
    filename: function(req, file, cb) {
        let username = "user";
        if (req.body && req.body.name) {
            // Split name into words, use first and last
            const words = req.body.name.trim().split(/\s+/);
            let first = words[0] || "";
            let last = words.length > 1 ? words[words.length - 1] : "";
            first = first.replace(/[^a-zA-Z0-9_]/g, "");
            last = last.replace(/[^a-zA-Z0-9_]/g, "");
            username = `${first}_${last}`;
        }
        cb(null, `${username}_resume.pdf`);
    },
});
const resumeUpload = multer({ storage: resumeStorage });

// Update Multer storage for profile photos to save with original extension
const profilePhotoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/profile_photos/"));
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});
const profilePhotoUpload = multer({ storage: profilePhotoStorage });

// Create user
router.post("/", async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
router.get("/", async(req, res) => {
    const users = await User.find();
    res.json(users);
});

// Get user by ID
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update user by ID
router.put("/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add PATCH route for partial updates
router.patch("/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Profile photo upload endpoint
router.post(
    "/:id/profile-photo",
    profilePhotoUpload.single("profilePhoto"),
    async(req, res) => {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id, { profilePhoto: `/uploads/profile_photos/${req.file.filename}` }, { new: true }
            );
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Resume upload endpoint
router.post("/:id/resume", resumeUpload.single("resume"), async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, {
                "profile.resume.url": `/uploads/resumes/${req.file.filename}`,
                "profile.resume.lastUpdated": new Date().toISOString(),
            }, { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user by ID
router.delete("/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add to users.js routes
// router.patch("/:userId/jobposts", async(req, res) => {
//     try {
//         const { jobId } = req.body;

//         const user = await User.findByIdAndUpdate(
//             req.params.userId, { $addToSet: { jobPosts: jobId } }, // Using $addToSet to avoid duplicates
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).send({ error: "User not found" });
//         }

//         res.send(user);
//     } catch (error) {
//         res.status(400).send({ error: error.message });
//     }
// });

router.patch('/:id/jobposts', async (req, res) => {
  const { jobId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { jobPosts: jobId } }, // addToSet avoids duplicates
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update jobPosts' });
  }
});
// Get user by ID with populated jobPosts (full job objects)
router.get('/:id/jobposts', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'jobPosts',
        model: 'Job'
      });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.jobPosts || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// routes/users.js
router.get('/:userId/unique-candidates', async(req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'jobPosts',
            populate: {
                path: 'applicants',
                select: 'userId'
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get all unique applicant user IDs
        const uniqueApplicantIds = new Set();

        user.jobPosts.forEach(job => {
            job.applicants.forEach(application => {
                uniqueApplicantIds.add(application.userId.toString());
            });
        });

        // Fetch user details for each unique applicant
        const candidateArray = await User.find({ _id: { $in: Array.from(uniqueApplicantIds) } })
            .select('name email profilePhoto skills experience education location resume');

        res.json({
            count: uniqueApplicantIds.size,
            candidates: candidateArray
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id/stats', async (req, res) => {
  try {
    const userId = req.params.id;
    // Get all applications for this user
    const Application = require('../models/Application');
    const applications = await Application.find({ userId });

    const totalApplications = applications.length;
    const acceptedCount = applications.filter(app => app.status === 'accepted').length;
    const interviewCount = applications.filter(app => app.status === 'interviewed').length;
    const offerCount = applications.filter(app => app.status === 'offer').length;

    // Calculate percentages
    const acceptedPercentage = totalApplications ? Math.round((acceptedCount / totalApplications) * 100) : 0;
    const interviewPercentage = totalApplications ? Math.round((interviewCount / totalApplications) * 100) : 0;
    const offerPercentage = totalApplications ? Math.round((offerCount / totalApplications) * 100) : 0;

    res.json({
      totalApplications,
      acceptedCount,
      acceptedPercentage,
      interviewCount,
      interviewPercentage,
      offerCount,
      offerPercentage
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;