const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.protected = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token; // Ensure the token is retrieved from cookies

    console.log("sdfs", token);


    if (!token) {
        return res.status(401).json({ message: "Unauthorized access. Token is missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify the JWT
        req.userId = decoded.userId; // Attach `userId` to `req` object
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
});
