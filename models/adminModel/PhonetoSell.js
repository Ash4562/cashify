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
       
    },
    storageCapacity: {
        type: String,
        enum: ['16GB', '32GB', '64GB', '128GB', '256GB',"512GB","1TB"],
        required: true,
    },
    physicalCondition: {
        type: String,
        enum: ['Like New', 'Average', 'Poor', 'Good'],
        required: true,
    },
    workProperly : {
        type: String,
        enum: ['yes', 'No'],
        required: true,
    },
    touchScreen : {
        type: String,
        enum: ['yes', 'No'],
        required: true,
    },
    batteryHealth  : {
        type: String,
        enum: ['good', 'Average', 'bad'],
        required: true,
    },
    cameras : {
        type: String,
        enum: ['both working', 'Back issues', 'front issues'],
        required: true,
    },
    speakerMicrophone: {
        type: String,
        enum: ['both working', 'Speaker issues', 'Microphone issues'],
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
    originalBox: {
        type: String,
        enum: ['yes', 'No'],
        required: true,
    },
    underWarranty: {
        type: String,
        enum: ['yes', 'No'],
        required: true,
    },
    repairedRefurbished: {
        type: String,
        enum: ['Screen Battery', 'motherboard',"No"],
        required: true,
    },
    calculatedPrice: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('PhonetoSellSchema', PhonetoSellSchema);