const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
const cors = require("cors");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/userPhonetoSell", require("./routes/adminRoute/userPhoneyoSell"));
app.use("/api/v1/adminAuth", require("./routes/adminRoute/adminAuthRoute"));
app.use("/api/v1/phone", require("./routes/adminRoute/phoneRoute"));
app.use("/api/v1/allpartners", require("./routes/adminRoute/partnerRoute"));

app.use("/api/v1/partner", require("./routes/partnerRoute/partnerFormRoute"));
// user
app.use("/api/v1/userAuth", require("./routes/userRoute/userAuthRoute"));
app.use("/api/v1/userAddress", require("./routes/userRoute/userAdress"));
// sfdsfsadf

app.use("*", (req, res) => {
    res.status(404).json({ message: "No resource found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ message: err.message || "Something went wrongs" });
});

mongoose.connection.once("open", () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongoose connected on 5000"))
    .catch((err) => console.error("MongoDB connection error:", err));
