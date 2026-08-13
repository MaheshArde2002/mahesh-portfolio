// ========== Server.js - Backend for Contact Form ==========
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Middleware ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (if you want to serve HTML from the same server)
app.use(express.static(path.join(__dirname)));

// ========== Email Configuration ==========
// For Gmail: Use App Password (enable 2FA first)
// For other providers: Configure accordingly
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password' // Use App Password for Gmail
    }
});

// ========== Routes ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please fill in all required fields.' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address.' 
        });
    }

    try {
        // Email to the portfolio owner (Mahesh)
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
            to: 'mahesh.arde2002@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #f8fafc; border-radius: 10px;">
                    <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                    <hr style="border-color: #e2e8f0;" />
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        ${message.replace(/\n/g, '<br />')}
                    </div>
                    <hr style="border-color: #e2e8f0;" />
                    <p style="color: #64748b; font-size: 0.85rem;">
                        This message was sent from your portfolio website.
                    </p>
                </div>
            `,
            text: `
                New Contact Form Submission
                
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                
                Message:
                ${message}
                
                ---
                This message was sent from your portfolio website.
            `
        };

        // Auto-reply to the person who contacted
        const autoReplyOptions = {
            from: `"Mahesh Arde" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
            to: email,
            subject: 'Thank you for reaching out!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #f8fafc; border-radius: 10px;">
                    <h2 style="color: #2563eb;">Hello ${name} 👋</h2>
                    <p>Thank you for reaching out to me through my portfolio!</p>
                    <p>I've received your message and will get back to you within <strong>24-48 hours</strong>.</p>
                    <hr style="border-color: #e2e8f0;" />
                    <p style="color: #64748b; font-size: 0.85rem;">
                        <strong>Your message:</strong><br />
                        ${message.replace(/\n/g, '<br />')}
                    </p>
                    <hr style="border-color: #e2e8f0;" />
                    <p style="color: #64748b; font-size: 0.85rem;">
                        In the meantime, feel free to connect with me on 
                        <a href="https://linkedin.com/in/mahesh-arde-75b0bb31a" style="color: #2563eb;">LinkedIn</a>.
                    </p>
                    <p style="color: #64748b; font-size: 0.85rem;">
                        Best regards,<br />
                        <strong style="color: #1e293b;">Mahesh Arde</strong><br />
                        AWS Cloud Practitioner | Linux Administrator
                    </p>
                </div>
            `,
            text: `
                Hello ${name},
                
                Thank you for reaching out to me through my portfolio!
                
                I've received your message and will get back to you within 24-48 hours.
                
                Your message:
                ${message}
                
                In the meantime, feel free to connect with me on LinkedIn.
                
                Best regards,
                Mahesh Arde
                AWS Cloud Practitioner | Linux Administrator
            `
        };

        // Send both emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReplyOptions);

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });

    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// ========== Health Check ==========
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// ========== Start Server ==========
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
});
