
const crypto = require('crypto');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');

// nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanegregg.cereno@gmail.com', // Your Gmail address
        pass: '051503Sg051503!', // Sir bali dito yung sa otp tanggalin ko na lang po yung pass kasi nilagay ko po yung app specific password ko po
    },
    tls: {
        rejectUnauthorized: false,
    },
});

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    console.log('Email received:', email);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000);

    try {
        const otpEntry = new Otp({ email, otp, expiresAt });
        await otpEntry.save();

        const mailOptions = {
            from: 'shanecereno15@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        };

        console.log('Sending email with options:', mailOptions);

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
            }
            console.log('OTP sent successfully to:', email);
            res.json({ message: 'OTP sent successfully' });
        });
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const otpEntry = await Otp.findOne({ otp, expiresAt: { $gt: new Date() } });

        if (!otpEntry) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        await Otp.deleteOne({ otp }); // Remove OTP after successful verification
        res.json({ success: true, message: 'OTP verified' });
    } catch (error) {
        console.error('Internal Server Error during OTP verification:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
