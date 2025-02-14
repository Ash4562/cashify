// models/Device.js
const mongoose = require('mongoose');

const PhonetoSellSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    PartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        // required: true,
    },
    deviceName: {
        type: String,
        required: true,
    },
    imeiNumber: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    storageCapacity: {
        type: String,
        enum: ['16GB', '32GB', '64GB', '128GB', '256GB'],
        required: true,
    },
    physicalCondition: {
        type: String,
        enum: ['Like New', 'Average', 'Poor', 'Good'],
        required: true,
    },
    chargingPortWorking: {
        type: Boolean,
        required: true,
    },
    originalAccessories: {
        type: String,
        enum: ['All', 'Some', 'None'],
        required: true,
    },
    calculatedPrice: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('PhonetoSellSchema', PhonetoSellSchema);