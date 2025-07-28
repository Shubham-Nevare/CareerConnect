const express = require("express");
const router = express.Router();
const SupportRequest = require("../models/SupportRequest");
const nodemailer = require("nodemailer");

router.post("/", async(req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // console.log("Support request received:", req.body);

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Save to MongoDB
        const supportRequest = new SupportRequest({
            name,
            email,
            subject,
            message,
            // user: user || null,
        });
        await supportRequest.save();
        // console.log("Support request saved to DB");

        // Send email using nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_EMAIL_PASSWORD,
            },
        });

        // Safely handle user role display
        // const userType = user?.role
        //   ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        //   : 'Guest';

        const mailOptions = {
            from: process.env.SUPPORT_EMAIL,
            to: process.env.SUPPORT_EMAIL, // send to support team inbox
            subject: `📩 Support Request: ${subject}`,
            // text: `\nFrom: ${name} <${email}>\n\nName: ${name}\nMail Id: ${email}\nSubject: ${subject} \n\nMessage:\n                 ${message}`,

            html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Support Request | CareerConnect</title>
  </head>
  <body style="font-family:'Poppins', sans-serif; line-height:1.6; color:#2d3748; background-color:#f8fafc; margin:0; padding:0;">
    <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0, 0, 0, 0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding:30px 25px 20px; color:white;">
        <div style="display:flex; align-items:center; justify-content:center; gap:15px; margin-bottom:16px;">
          <img src="https://drive.google.com/uc?export=view&id=1-FFPvm8J9mecgocbT8noqpcFHIJEFOKB" alt="CareerConnect" style="height:32px; border-radius:4px; background:white; padding:6px 10px; box-shadow:0 4px 12px rgba(0, 0, 0, 0.1);" />
          <h1 style="font-size:28px; font-weight:700; margin:0; color:white; padding-left:10px;">CareerConnect</h1>
        </div>
        
        <div style="display:flex; justify-content:end; margin-top:8px;">
          <div style="display:inline-flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.15); padding:10px 18px; border-radius:24px; font-weight:500; font-size:14px; gap:8px; color:white;">
              <span style="padding-right: 10px;">📩</span>New Ticket Received
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:30px;">
        <h1 style="font-size:22px; font-weight:600; color:#1e293b; margin-bottom:20px; position:relative; padding-bottom:10px; border-bottom:3px solid #3b82f6; display:inline-block;">
          Support Request
          <span style="display:inline-block; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; background:#fef3c7; color:#92400e; margin-left:10px;">PRIORITY</span>
        </h1>

        <div style="background:white; border-radius:10px; padding:20px; margin-bottom:25px; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <div style="min-width:120px; font-weight:500; color:#64748b;">From:</div>
            <div style="flex:1; font-weight:500; color:#1e293b;">${name} &lt;${email}&gt;</div>
          </div>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <div style="min-width:120px; font-weight:500; color:#64748b;">Received:</div>
            <div style="flex:1; font-weight:500; color:#1e293b;">${new Date().toLocaleString()}</div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="min-width:120px; font-weight:500; color:#64748b;">Subject:</div>
            <div style="flex:1; font-weight:500; color:#1e293b;">${subject}</div>
          </div>
        </div>

        <div>
          <div style="font-weight:500; color:#64748b; margin-bottom:8px;">Message:</div>
          <div style="background:#f8fafc; border-left:4px solid #3b82f6; padding:18px; border-radius:0 8px 8px 0; margin-top:8px; font-size:15px; line-height:1.7;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div style="text-align:center; margin-top:30px;">
          <a href="${process.env.ADMIN_DASHBOARD_URL}/support/tickets" style="display:inline-block; background:#3b82f6; color:white; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:500; transition:all 0.3s ease;">
            View in Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align:center; padding:20px; background:#f1f5f9; color:#64748b; font-size:12px;">
        <p style="margin:4px 0;">© ${new Date().getFullYear()} CareerConnect. All rights reserved.</p>
        <p style="margin:4px 0;">This is an automated message. Please do not reply directly to this email.</p>
        <p style="margin-top:8px;">
          <a href="${process.env.BASE_URL}" style="color:#3b82f6; text-decoration:none;">Visit Website</a> |
          <a href="${process.env.ADMIN_DASHBOARD_URL}" style="color:#3b82f6; text-decoration:none;">Admin Portal</a>
        </p>
      </div>
    </div>
  </body>
</html>

`,
        };

        await transporter.sendMail(mailOptions);
        // console.log("Support email sent");

        res
            .status(200)
            .json({ message: "Support request submitted successfully." });
    } catch (error) {
        console.error("❌ Error handling support request:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

module.exports = router;