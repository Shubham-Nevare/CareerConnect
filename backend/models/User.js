const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["jobseeker", "recruiter"],
        required: true,
    },
    profilePhoto: { type: String },
    status: { type: String, enum: ["active", "banned"], default: "active" },
    // Recruiter-specific fields
    recruiter: {
        phone: String,
        position: String,
        socialLinks: {
            linkedin: String,
        },
    },
    // Reference to company (for recruiters)
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    jobPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }, ],
    // Jobseeker profile (unchanged)
    profile: {
        basicInfo: {
            name: String,
            email: String,
            phone: String,
            location: String,
            headline: String,
            summary: String,
            profilePhoto: String,
        },
        experience: [{
            id: String,
            title: String,
            company: String,
            location: String,
            startDate: String,
            endDate: String,
            currentJob: Boolean,
            description: String,
        }, ],
        education: [{
            id: String,
            degree: String,
            institution: String,
            field: String,
            startDate: String,
            endDate: String,
        }, ],
        skills: [{
            name: String,
            level: String,
        }, ],
        certifications: [{
            name: String,
            issuer: String,
            date: String,
        }, ],
        socialLinks: {
            linkedin: String,
            github: String,
            portfolio: String,
        },
        resume: {
            url: String,
            lastUpdated: String,
        },
        preferences: {
            jobTypes: [String],
            locations: [String],
            salaryExpectation: String,
            visibility: String,
        },
        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
        applications: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
        ],
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);