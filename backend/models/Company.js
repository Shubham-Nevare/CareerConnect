const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: String,
    industry: String,
    description: String,
    website: String,
    founded: String,
    employees: String,
    location: String,
    verified: { type: Boolean, default: false },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);