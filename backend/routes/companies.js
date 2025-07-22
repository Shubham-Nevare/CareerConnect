const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const multer = require('multer');
const path = require('path');

const logoUpload = multer({ dest: path.join(__dirname, '../uploads/company_logos/') });

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

// Company logo upload endpoint
router.post('/:id/logo', logoUpload.single('logo'), async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id, { logo: `/uploads/company_logos/${req.file.filename}` }, { new: true }
        );
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;