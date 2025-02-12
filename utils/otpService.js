const Otp = require('../models/userModel/Otp');

const generateOtp = async (mobile, otp) => {
    const otpExpiry = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes
    const otpTimestamp = Date.now();

    const existingOtp = await Otp.findOne({ mobile });

    if (existingOtp) {
        existingOtp.otp = otp;
        existingOtp.expiry = otpExpiry;
        existingOtp.timestamp = otpTimestamp;
        await existingOtp.save();
    } else {
        const otpData = new Otp({
            mobile,
            otp,
            expiry: otpExpiry,
            timestamp: otpTimestamp,
        });
        await otpData.save();
    }
};

// Retrieve OTP from the database
const getOtp = async (mobile) => {
    return await Otp.findOne({ mobile });
};

// Delete OTP after successful verification or after expiry
const deleteOtp = async (mobile) => {
    await Otp.deleteOne({ mobile });
};

module.exports = { generateOtp, getOtp, deleteOtp };
