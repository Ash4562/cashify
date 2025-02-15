const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // Corrected import path

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "businessDocuments",
        allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    },
});

const upload = multer({ storage });

module.exports = upload;