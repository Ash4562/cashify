const mongoose = require("mongoose")

const AdressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,

            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true,
        },
        HomeOrFlat: {
            type: String,
            required: true,
        },
        AreaOrLocality: {
            type: String,
            required: true,
        },
        Picode: {
            type: String,
            required: true,
        }

    }
)

module.exports = mongoose.model('Address', AdressSchema);