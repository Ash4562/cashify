const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    businessAddress: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    gstNumber: {
      type: String,
      required: true,
      unique: true
    },
    role: { 
        type: String, 
        default: 'partner'
     },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    approvedAt: {
      type: Date,
      default: null
    },
    rejectedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true })

module.exports = mongoose.model("Partner", partnerSchema);
