require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const companiesRouter = require('./routes/companies');
const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const supportRouter = require('./routes/support');

const cors = require('cors');
const path = require('path');

app.get('/', (req, res) => {
    res.send('Job Portal Backend API');
});


app.use(cors());

app.use(express.json());

// Serve uploads directory as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a dedicated route for serving resumes with consistent download filename
app.get('/uploads/resumes/:filename', async(req, res) => {
    const filePath = path.join(__dirname, 'uploads', 'resumes', req.params.filename);
    // Extract the base name (without extension) from the filename
    const match = req.params.filename.match(/^([a-zA-Z0-9]+)_([a-zA-Z0-9]+)_resume\.pdf$/);
    let downloadName = 'resume.pdf';
    if (match) {
        downloadName = `${match[1]}_${match[2]}_resume.pdf`;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/jobs', jobsRouter);
app.use('/applications', applicationsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/support', supportRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on:${process.env.PORT}`);
});