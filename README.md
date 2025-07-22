# CareerConnect

<img width="1888" height="788" alt="image" src="https://github.com/user-attachments/assets/9387128e-93b2-4445-a601-094c72bca68a" />


A modern job portal platform connecting job seekers with recruiters and companies. CareerConnect provides a seamless experience for finding jobs, managing applications, and discovering talent.

## Features

### For Job Seekers
- 📝 Create detailed profiles with skills, experience, and education
- 🔍 Search and filter job listings
- ⚡ One-click application system
- 📊 Track application status
- 📥 Resume upload and management

### For Recruiters
- 🏢 Company profile management
- 📢 Post and manage job listings
- 🔎 Search for qualified candidates
- 📩 Manage incoming applications
- 📈 Hiring analytics dashboard

## Tech Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- React Hook Form
- Framer Motion (animations)

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Nodemailer (email notifications)

- MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shubham-Nevare/CareerConnect.git
cd CareerConnect
Install dependencies:
```
bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
Set up environment variables:
Create .env files in both server and client directories based on the provided .env.example files.

Run the development server:

bash
# In server directory
npm run dev

# In client directory
npm run dev
Project Structure
text
CareerConnect/
├── frontend/               # Frontend Next.js application
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application routes
│   └── styles/           # Global styles
│
├── backend/               # Backend Node.js server
│   ├── config/           # Database and auth config
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── utils/            # Helper functions
│
├── docker/               # Docker configuration
├── .github/              # GitHub workflows
└── README.md             # Project documentation
