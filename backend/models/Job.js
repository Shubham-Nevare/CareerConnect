const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    location: String,
    salary: { type: Number, required: true },
    type: { type: String, required: true },
    requirements: { type: [String], required: true },
    responsibilities: { type: [String], required: true },
    experience: { type: String },
    status: { type: String, enum: ['active', 'closed', 'archived'], default: 'active' },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
}, { timestamps: true });

jobSchema.statics.findWithCompanyAndApplicants = function(query = {}) {
    return this.find(query)
        .populate('company', 'name email role company')
        .populate({
            path: 'applicants',
            populate: { path: 'applicant', select: 'name email role' },
        });
};

module.exports = mongoose.model('Job', jobSchema);