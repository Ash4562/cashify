const multer = require('multer');
const path = require('path');

// Configure storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Set filename to unique timestamp + extension
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
