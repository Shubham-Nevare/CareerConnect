const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
        type: String,
        enum: ['applied', 'interviewed', 'rejected', 'accepted'],
        default: 'applied'
    },
    appliedDate: { type: Date, default: Date.now },
    resume: String,
});

module.exports = mongoose.model('Application', applicationSchema);