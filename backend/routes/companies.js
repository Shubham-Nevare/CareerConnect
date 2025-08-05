require('dotenv').config();
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// console.log('Cloudinary ENV:', process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);

// Create company
router.post('/', async(req, res) => {
    try {
        // console.log('Company create req.body:', req.body);
        const company = new Company({
            ...req.body,
            recruiters: req.body.recruiters || []
        });
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all companies
router.get('/', async(req, res) => {
    const companies = await Company.find();
    res.json(companies);
});

// Get company by ID
router.get('/:id', async(req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update company by ID
router.put('/:id', async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add PATCH route for partial updates and $addToSet
router.patch('/:id', async(req, res) => {
    try {
        const update = {...req.body };
        // If $addToSet is present, use it for recruiters
        let updateQuery = update;
        if (update.$addToSet) {
            updateQuery = {...update, $addToSet: update.$addToSet };
            delete updateQuery.$addToSet;
        }
        const company = await Company.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete company by ID
router.delete('/:id', async(req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json({ message: 'Company deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Company logo upload endpoint (Cloudinary)
router.post('/:id/logo', upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Upload to Cloudinary
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'company_logos' },
            async (error, result) => {
                if (error) return res.status(500).json({ error: error.message });

                // Save Cloudinary URL in DB
                const company = await Company.findByIdAndUpdate(
                    req.params.id,
                    { logo: result.secure_url },
                    { new: true }
                );
                if (!company) return res.status(404).json({ error: 'Company not found' });
                res.json(company);
            }
        );
        stream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;