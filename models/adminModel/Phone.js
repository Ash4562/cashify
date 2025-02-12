const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    phoneName: {
        type: String,
        required: true
    },
    phone_id: {
        type: String,
        unique: true,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    variants: [
        {
            storage: [{
                type: String,
                required: true
            }],
            ram: [{
                type: String,
                required: true
            }],
            colors: [
                {
                    color: { type: String, required: true },
                    Cprice: { type: Number, required: true },
                    images: [
                        {
                            original: { type: String, required: true },
                            smallSize: { type: String, required: true },
                            zoomImage: { type: String, required: true },
                        },
                    ],
                },
            ],
        },
    ],
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Phone', phoneSchema);
