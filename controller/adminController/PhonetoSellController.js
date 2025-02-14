const cloudinary = require('../../config/cloudinary');
const PhonetoSell = require("../../models/adminModel/PhonetoSell");

const calculatePrice = (basePrice, storageCapacity, physicalCondition, chargingPortWorking, originalAccessories) => {
    let price = basePrice;


    if (storageCapacity === '32GB') price *= 1.02;
    else if (storageCapacity === '64GB') price *= 1.02;
    else if (storageCapacity === '128GB') price *= 1.02;
    else if (storageCapacity === '256GB') price *= 1.04;


    if (physicalCondition === 'Average') price *= 0.98;
    else if (physicalCondition === 'Poor') price *= 0.96;
    else if (physicalCondition === 'Good') price *= 0.94;


    if (!chargingPortWorking) price *= 0.98;

    if (originalAccessories === 'Some') price *= 0.98;
    else if (originalAccessories === 'None') price *= 0.96;

    return price;
};
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await PhonetoSell.find();
        if (devices.length === 0) {
            return res.status(404).json({ message: 'No devices found' });
        }
        res.status(200).json({ message: 'Devices fetched successfully', devices });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching devices', error: err });
    }
};


exports.createDevice = async (req, res) => {
    try {
        console.log("hekkkooo");
        const { userId, deviceName, imeiNumber, storageCapacity, physicalCondition, chargingPortWorking, originalAccessories } = req.body;
        const basePrice = 20000;
        
        let imageUrls = [];

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded!" });
        }

        // 🔹 Upload each image to Cloudinary
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
        }

        const calculatedPrice = calculatePrice(basePrice, storageCapacity, physicalCondition, chargingPortWorking, originalAccessories);

        const newDevice = new PhonetoSell({
            userId,
            deviceName,
            imeiNumber,
            images: imageUrls,
            storageCapacity,
            physicalCondition,
            chargingPortWorking,
            originalAccessories,
            calculatedPrice,
        });

        await newDevice.save();
        res.status(201).json({ message: "Device created successfully", device: newDevice });

    } catch (err) {
        console.error("🔥 Error:", err);
        res.status(500).json({ message: "Error creating device", error: err.message });
    }
};
// Get a device by ID
exports.getDeviceById = async (req, res) => {
    const { id } = req.params;

    try {
        const device = await PhonetoSell.findById(id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.status(200).json({ message: 'Device fetched successfully', device });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching device', error: err });
    }
};

exports.getUserIdDevices = async (req, res) => {
    const { userId } = req.params;

    try {
        const devices = await PhonetoSell.find({ userId });
        if (devices.length === 0) {
            return res.status(404).json({ message: 'No devices found for this user' });
        }
        res.status(200).json({ message: 'Devices fetched successfully', devices });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching devices', error: err });
    }
};

exports.deleteDevice = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDevice = await PhonetoSell.findByIdAndDelete(id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.status(200).json({ message: 'Device deleted successfully', device: deletedDevice });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting device', error: err });
    }
};


exports.updateDevice = async (req, res) => {
    const { id } = req.params;
    const { deviceName, imeiNumber, storageCapacity, physicalCondition, chargingPortWorking, originalAccessories, PartnerId } = req.body;
    const basePrice = 20000;

    const calculatedPrice = calculatePrice(basePrice, storageCapacity, physicalCondition, chargingPortWorking, originalAccessories);

    try {



        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                uploadedFiles[file.fieldname] = cloudinaryResponse.secure_url;
            }
        }

        const updateData = {
            deviceName,
            imeiNumber,
            storageCapacity,
            physicalCondition,
            chargingPortWorking,
            originalAccessories,
            calculatedPrice,
            PartnerId,
        };

        if (imageUrls.length > 0) {
            updateData.image = imageUrls;
        }

        const updatedDevice = await PhonetoSell.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.status(200).json({ message: 'Device updated successfully', device: updatedDevice });
    } catch (err) {
        res.status(500).json({ message: 'Error updating device', error: err });
    }
};

// Update multiple devices with PartnerId
exports.updateMultipleDevices = async (req, res) => {
    const { deviceIds, PartnerId } = req.body;

    try {
        const updatedDevices = await PhonetoSell.updateMany(
            { _id: { $in: deviceIds } },
            { PartnerId },
            { new: true } // Return the updated documents
        );

        if (updatedDevices.nModified === 0) {
            return res.status(404).json({ message: 'No devices found or updated' });
        }
        res.status(200).json({ message: 'Devices updated successfully', updatedDevices });
    } catch (err) {
        res.status(500).json({ message: 'Error updating devices', error: err });
    }
};