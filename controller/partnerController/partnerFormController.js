const asyncHandler = require('express-async-handler');
const Partner = require('../../models/partnerModel/Partner');
const { sendOtp } = require('../../utils/sendOtp');
const jwt = require('jsonwebtoken');

const otpStore = {};


exports.createPartner = asyncHandler(async (req, res) => {
    const { name, mobile, email, businessAddress, city, companyName, gstNumber } = req.body;

    if (!name || !mobile || !email || !businessAddress || !city || !companyName || !gstNumber) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingPartner = await Partner.findOne({ mobile });
    if (existingPartner) {
        return res.status(400).json({ message: 'Partner with this mobile number already exists.' });
    }

    const partner = new Partner({
        name,
        mobile,
        email,
        businessAddress,
        city,
        companyName,
        gstNumber,
        status: 'pending',
    });

    try {
        await partner.save();
        return res.status(201).json({ message: 'Partner created successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating partner.' });
    }
});

exports.partnerLogin = asyncHandler(async (req, res) => {
    const { mobile } = req.body;

    const partner = await Partner.findOne({ mobile });
    if (!partner) {
        return res.status(404).json({ message: 'Partner not found.' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStore[mobile] = {
        otp,
        createdAt: Date.now(), 
    };
    console.log(`OTP for ${mobile}: ${otp}`);

    await sendOtp(mobile, otp);

    return res.status(200).json({ message: 'OTP sent to your mobile number.' });
});

// Verify OTP and Log In
exports.verifyOtp = asyncHandler(async (req, res) => {
    const { mobile, otp } = req.body;

    // Check if OTP exists and is not expired
    if (otpStore[mobile]) {
        const otpData = otpStore[mobile];
        const otpExpirationTime = 5 * 60 * 1000; // OTP valid for 5 minutes

        if (Date.now() - otpData.createdAt > otpExpirationTime) {
            delete otpStore[mobile]; // Expire OTP after time limit
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        if (otpData.otp === parseInt(otp)) {
            const token = jwt.sign({ id: mobile }, process.env.JWT_KEY, { expiresIn: '1h' });

            delete otpStore[mobile];

            res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            return res.status(200).json({ message: 'Login successful.' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
    } else {
        return res.status(400).json({ message: 'OTP not found or expired.' });
    }
});

exports.getPartnerProfile = asyncHandler(async (req, res) => {
    try {
        const partner = await Partner.findOne({ mobile: req.partner.id }); 

        if (!partner) {
            return res.status(404).json({ message: 'Partner not found.' });
        }

        res.status(200).json(partner);
    } catch (error) {
        console.error("Error Fetching Partner Profile:", error);
        return res.status(500).json({ message: 'Error fetching partner profile.' });
    }
});


exports.updatePartnerProfile = asyncHandler(async (req, res) => {
    const { name, mobile, email, businessAddress, city, companyName, gstNumber } = req.body;

    if (!name || !mobile || !email || !businessAddress || !city || !companyName || !gstNumber) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const partner = await Partner.findById(req.partner.id); // Use `id` from JWT
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found.' });
        }

        partner.name = name;
        partner.mobile = mobile;
        partner.email = email;
        partner.businessAddress = businessAddress;
        partner.city = city;
        partner.companyName = companyName;
        partner.gstNumber = gstNumber;

        await partner.save();
        return res.status(200).json({ message: 'Partner profile updated successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating partner profile.' });
    }
});
