const Address = require('../../models/userModel/Adress');
const asyncHandler = require('express-async-handler');


// Create a new address
exports.createAddress = asyncHandler(async (req, res) => {
    const { name, mobileNo, HomeOrFlat, AreaOrLocality, Picode, userId } = req.body;
    console.log(req.body);

    // Validation
    if (!name || !mobileNo || !HomeOrFlat || !AreaOrLocality || !Picode || !userId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create new address
    const newAddress = await Address.create({
        userId, // Storing userId
        name,
        mobileNo,
        HomeOrFlat,
        AreaOrLocality,
        Picode
    });


    res.status(201).json(newAddress);
});

// Get all addresses for a specific user
exports.getAllAddresses = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log("uerid", userId);

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const addresses = await Address.find({ userId });

    res.status(200).json(addresses);
});

// Get address by ID
exports.getAddressById = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (!address) {
        return res.status(404).json({ message: 'Address not found.' });
    }

    res.status(200).json(address);
});

// Update an address
exports.updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedAddress) {
        return res.status(404).json({ message: 'Address not found.' });
    }

    res.status(200).json(updatedAddress);
});

// Delete an address
exports.deleteAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
        return res.status(404).json({ message: 'Address not found.' });
    }

    res.status(200).json({ message: 'Address deleted successfully.' });
});
