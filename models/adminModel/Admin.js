const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    otp: {
      type: String, // Store OTP hash securely
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
