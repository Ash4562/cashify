const PhonetoSell = require("../../models/adminModel/PhonetoSell");
const cloudinary = require("../../config/cloudinary");

const calculatePrice = (basePrice, storageCapacity,workProperly,
     physicalCondition,touchScreen,batteryHealth,cameras,speakerMicrophone,
     originalBox,underWarranty,repairedRefurbished, chargingPortWorking, originalAccessories) => {
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

    if (batteryHealth === 'Average') price *= 0.98;
    else if (batteryHealth === 'bad') price *= 0.96;

    
    if (cameras === 'Back issues') price *= 0.98;
    else if (cameras === 'front issues') price *= 0.98;


    if (speakerMicrophone === 'Speaker issues') price *= 0.98;
    else if (speakerMicrophone === 'Microphone issues') price *= 0.98;


    if (repairedRefurbished === 'motherboard') price *= 0.98;
    else if (repairedRefurbished === 'Screen Battery') price *= 0.98;
    

    
    if (touchScreen === 'No') price *= 0.98;
    if (workProperly === 'No') price *= 0.98;
    if (originalBox === 'No') price *= 0.98;
    if (underWarranty === 'No') price *= 0.98;


    return price;
};

exports.createDevice = async (req, res) => {
    try {
        console.log("🖼 Uploaded Files:", req.files);  // Debugging uploaded files

        const { userId, deviceName, imeiNumber,storageCapacity,workProperly,
     physicalCondition,touchScreen,batteryHealth,cameras,speakerMicrophone,
     originalBox,underWarranty,repairedRefurbished, chargingPortWorking, originalAccessories } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded!" });
        }

        // Get Cloudinary image URLs
        const imageUrls = req.files.map(file => file.path);
        console.log("✅ Uploaded Image URLs:", imageUrls); // Debugging

        const calculatedPrice = calculatePrice(20000,storageCapacity,workProperly,
     physicalCondition,touchScreen,batteryHealth,cameras,speakerMicrophone,
     originalBox,underWarranty,repairedRefurbished, chargingPortWorking, originalAccessories);

        const newDevice = new PhonetoSell({
            userId,
            deviceName,
            imeiNumber,
            images: imageUrls, // Save multiple images
            storageCapacity,workProperly,
            physicalCondition,touchScreen,batteryHealth,cameras,speakerMicrophone,
            originalBox,underWarranty,repairedRefurbished, chargingPortWorking, originalAccessories,
            calculatedPrice,
        });

        await newDevice.save();
        res.status(201).json({ message: "Device created successfully", device: newDevice });

    } catch (err) {
        console.error("🔥 Error in createDevice:", err);
        res.status(500).json({ message: "Error creating device", error: err.message });
    }
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
    const {
        deviceName,
        imeiNumber,
        storageCapacity,
        workProperly,
        physicalCondition,
        touchScreen,
        batteryHealth,
        cameras,
        speakerMicrophone,
        originalBox,
        underWarranty,
        repairedRefurbished,
        chargingPortWorking,
        originalAccessories,
        PartnerId,
    } = req.body;

    const basePrice = 20000;

    // Calculate the updated price
    const calculatedPrice = calculatePrice(
        basePrice,
        storageCapacity,
        workProperly,
        physicalCondition,
        touchScreen,
        batteryHealth,
        cameras,
        speakerMicrophone,
        originalBox,
        underWarranty,
        repairedRefurbished,
        chargingPortWorking,
        originalAccessories
    );

    try {
        const existingDevice = await PhonetoSell.findById(id);
        if (!existingDevice) {
            return res.status(404).json({ message: "Device not found" });
        }

        let imageUrls = existingDevice.images || []; // Keep existing images

        // Upload new images to Cloudinary if provided
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path);
                    return result.secure_url;
                })
            );

            imageUrls = [...imageUrls, ...uploadedImages]; // Combine old and new images
        }

        // Prepare the update data
        const updateData = {
            deviceName,
            imeiNumber,
            storageCapacity,
            workProperly,
            physicalCondition,
            touchScreen,
            batteryHealth,
            cameras,
            speakerMicrophone,
            originalBox,
            underWarranty,
            repairedRefurbished,
            chargingPortWorking,
            originalAccessories,
            PartnerId,
            calculatedPrice, // Include the updated price
            images: imageUrls, // Include updated images
        };

        // Log the update data for debugging
        console.log("Update Data:", updateData);

        // Update the device in the database
        const updatedDevice = await PhonetoSell.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedDevice) {
            return res.status(404).json({ message: "Device not found" });
        }

        // Log the updated device for debugging
        console.log("Updated Device:", updatedDevice);

        res.status(200).json({ message: "Device updated successfully", device: updatedDevice });

    } catch (err) {
        console.error("🔥 Error in updateDevice:", err);

        // Log validation errors if any
        if (err.name === "ValidationError") {
            console.error("Validation Errors:", err.errors);
        }

        res.status(500).json({ message: "Error updating device", error: err.message });
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