const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true, // Ensure only one OTP is stored per mobile number
    },
    otp: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Otp', otpSchema);

