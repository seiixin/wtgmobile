const crypto = require('crypto');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');

// nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'walktograve@gmail.com', // Your Gmail address
        pass: 'asys iqgr tmyj uwgd', // Sir bali dito yung sa otp tanggalin ko na lang po yung pass kasi nilagay ko po yung app specific password ko po
    },
    tls: {
        rejectUnauthorized: false,
    },
});

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    console.log('Email received:', email);

    // Generate OTP and set expiration to 1 minute
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 1 * 60000); // 1 minute

    try {
        // Save OTP to the database
        const otpEntry = new Otp({ email, otp, expiresAt });
        await otpEntry.save();

        // Email configuration
        const mailOptions = {
            from: 'walktograve@gmail.com',
            to: email,
            subject: 'WalkToGrave: Your One-Time Password (OTP)',
            text: `Hello,

We received a request to verify your email address for WalkToGrave.

Your One-Time Password (OTP) is: ${otp}

This code will expire in 1 minute. Please do not share this code with anyone.

If you did not request this, you can safely ignore this email.

Thank you,
The WalkToGrave Team`,
        };

        console.log('Sending email with options:', mailOptions);

        // Send OTP via email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
            }
            console.log('OTP sent successfully:', info.response);
            res.json({ success: true, message: 'OTP sent successfully' });
        });
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        // Check if the OTP exists and is not expired
        const otpEntry = await Otp.findOne({ otp, expiresAt: { $gt: new Date() } });

        if (!otpEntry) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Remove OTP after successful verification
        await Otp.deleteOne({ otp });
        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Internal Server Error during OTP verification:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
