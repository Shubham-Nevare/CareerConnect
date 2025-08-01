const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const multer = require('multer');
const path = require('path');

const logoUpload = multer({ dest: path.join(__dirname, '../uploads/company_logos/') });

// Create company (logo as base64 string)
router.post('/', async(req, res) => {
    try {
        const companyData = { ...req.body, recruiters: req.body.recruiters || [] };
        // If logo is present and is base64, store as is
        if (req.body.logo && req.body.logo.startsWith('data:image')) {
            companyData.logo = req.body.logo;
        }
        const company = new Company(companyData);
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

// Update company by ID (logo as base64 string)
router.put('/:id', async(req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.body.logo && req.body.logo.startsWith('data:image')) {
            updateData.logo = req.body.logo;
        }
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

// Company logo upload endpoint (accept base64 string)
router.post('/:id/logo', async(req, res) => {
    try {
        // Expect { logo: 'data:image/png;base64,...' } in body
        if (!req.body.logo || !req.body.logo.startsWith('data:image')) {
            return res.status(400).json({ error: 'Logo must be a base64 image string' });
        }
        const company = await Company.findByIdAndUpdate(
            req.params.id, { logo: req.body.logo }, { new: true }
        );
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;