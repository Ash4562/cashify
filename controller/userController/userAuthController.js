const asyncHandler = require('express-async-handler');
const { sendOtp } = require('../../utils/sendOtp');
const { generateOtp, getOtp, deleteOtp } = require('../../utils/otpService');
const User = require('../../models/userModel/User');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const otpResendLimiter = async (req, res, next) => {
    const { mobile } = req.body;
    const otpData = await getOtp(mobile);

    if (otpData && Date.now() - otpData.timestamp < 2 * 60 * 1000) {
        return res.status(429).json({ message: 'Too many OTP resend attempts. Please try again later.' });
    }

    next();
};

const generateAndSendOtp = async (mobile, name) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await generateOtp(mobile, otp);
    await sendOtp(mobile, otp);
};

exports.registerOrLogin = [
    otpResendLimiter,
    asyncHandler(async (req, res) => {
        const { mobile, name } = req.body;

        if (!mobile) {
            return res.status(400).json({ message: 'Mobile number is required.' });
        }

        if (!validator.isMobilePhone(mobile, 'en-IN')) {
            return res.status(400).json({ message: 'Invalid mobile number format.' });
        }

        const formattedMobile = mobile.startsWith('+91') ? mobile : `+91${mobile.replace(/^0?/, '')}`;
        let user = await User.findOne({ mobile: formattedMobile });

        if (user && !name) {
            await generateAndSendOtp(formattedMobile);
            return res.status(200).json({ message: 'OTP sent successfully. Please verify to login.' });
        }

        if (!user && name) {
            await generateAndSendOtp(formattedMobile, name);
            return res.status(200).json({ message: 'OTP sent successfully. Please verify to complete registration.' });
        }

        return res.status(400).json({
            message: user ? 'User already exists. Please login.' : 'User not found. Please register.',
        });
    }),
];

exports.verifyOtpForUser = asyncHandler(async (req, res) => {
    const { otp, mobile } = req.body;

    if (!otp || !mobile) {
        return res.status(400).json({ message: 'OTP and mobile number are required.' });
    }

    const otpData = await getOtp(mobile);

    if (!otpData || otpData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (otpData.expiry < Date.now()) {
        await deleteOtp(mobile);
        return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
        user = new User({
            mobile,
            name: req.body.name || '',
        });
        await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '7d' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Token expiration: 7 days
    });

    // Delete OTP data after successful verification
    await deleteOtp(mobile);

    res.status(200).json({
        message: 'OTP verified successfully. Registration complete.',
        token,
        user: { name: user.name, mobile: user.mobile },
    });
});

exports.getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
});

// Update User
exports.updateUser = asyncHandler(async (req, res) => {
    const { name, alternateMobile } = req.body;

    const user = await User.findById(req.userId)
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.name = name || user.name;
    user.alternateMobile = alternateMobile || user.alternateMobile;
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
});
