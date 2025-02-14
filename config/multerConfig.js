const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder:"images",
    allowedFormats: ["jpg", "png", "jpeg"],
    
});

const upload = multer({ storage: storage });

module.exports = upload;

