const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../../models/adminModel/Admin');
const sendOtp = require('../../utils/sendOtp'); // Twilio OTP function

// JWT Token Generation
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '30d' });
};

// **Register Admin (Now OTP Verification Included)**
exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
        return res.status(400).json({ message: 'Name and mobile are required.' });
    }

    let admin = await Admin.findOne({ mobile });

    if (admin) {
        // If already registered but OTP is not verified (expired)
        if (!admin.otp || admin.otpExpires < Date.now()) {
            const otp = crypto.randomInt(1000, 9999); // Generate OTP
            const otpHash = crypto.createHash('sha256').update(String(otp)).digest('hex');

            // Send new OTP automatically
            await sendOtp.sendOtp(`+${mobile}`, otp);

            admin.otp = otpHash;
            admin.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 mins
            await admin.save();

            return res.status(400).json({ message: 'Admin already registered but OTP expired. A new OTP has been sent.' });
        }

        return res.status(400).json({ message: 'Admin already registered with this mobile number.' });
    }

    // Create new admin and send OTP for verification
    const otp = crypto.randomInt(1000, 9999);
    const otpHash = crypto.createHash('sha256').update(String(otp)).digest('hex');

    admin = await Admin.create({
        name,
        mobile,
        role: 'admin',
        otp: otpHash,
        otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendOtp.sendOtp(`+${mobile}`, otp);

    return res.status(201).json({
        message: 'Registration successful. OTP sent to verify your mobile number.',
    });
});

// **Login Admin (OTP-based)**
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required.' });
    }

    const admin = await Admin.findOne({ mobile });

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found with this mobile number.' });
    }

    const otp = crypto.randomInt(1000, 9999);
    const otpHash = crypto.createHash('sha256').update(String(otp)).digest('hex');

    await sendOtp.sendOtp(`+${mobile}`, otp);

    admin.otp = otpHash;
    admin.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await admin.save();

    return res.status(200).json({
        message: 'OTP sent to your mobile number. Please verify within 10 minutes.',
    });
});

// **Verify OTP for Login & Registration**
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    const admin = await Admin.findOne({ mobile });

    if (!admin) {
        return res.status(404).json({ message: 'Admin not found with this mobile number.' });
    }

    const hashedOTP = crypto.createHash('sha256').update(String(otp)).digest('hex');

    if (admin.otp !== hashedOTP || admin.otpExpires < Date.now()) {
        const newOtp = crypto.randomInt(1000, 9999);
        const newOtpHash = crypto.createHash('sha256').update(String(newOtp)).digest('hex');

        await sendOtp.sendOtp(`+${mobile}`, newOtp);

        admin.otp = newOtpHash;
        admin.otpExpires = Date.now() + 10 * 60 * 1000;
        await admin.save();

        return res.status(400).json({ message: 'OTP expired or incorrect. A new OTP has been sent.' });
    }

    const token = generateToken(admin._id);
    res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        _id: admin.id,
        name: admin.name,
        mobile: admin.mobile,
        role: admin.role,
        message: 'Login successful',
        token,
    });
});

// **Logout Admin**
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('auth_token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    return res.status(200).json({ message: 'Logout successful' });
});

// **Get Admin Profile (Protected Route)**
exports.getAdminProfile = asyncHandler(async (req, res) => {
    const admin = req.admin;

    return res.status(200).json({
        _id: admin.id,
        name: admin.name,
        mobile: admin.mobile,
        role: admin.role,
    });
});
