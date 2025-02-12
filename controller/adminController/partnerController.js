const asyncHandler = require('express-async-handler');
const Partner = require('../../models/partnerModel/Partner');

exports.getAllPartners = asyncHandler(async (req, res) => {
    try {
        const partners = await Partner.find();
        console.log("dddd", partners);

        return res.status(200).json(partners);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching partners.' });
    }
});

exports.updatePartnerStatus = asyncHandler(async (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ message: 'Partner ID and status are required.' });
    }

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. It should be "approved" or "rejected".' });
    }

    try {
        const partner = await Partner.findById(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found.' });
        }

        partner.status = status;

        if (status === 'approved') {
            partner.approvedAt = new Date();
        } else if (status === 'rejected') {
            partner.rejectedAt = new Date();
        }

        await partner.save();
        return res.status(200).json({ message: `Partner ${status} successfully.` });
    } catch (error) {
        return res.status(500).json({ message: `Error updating partner status: ${error.message}` });
    }
});

exports.deletePartner = asyncHandler(async (req, res) => {
    const { id } = req.body; // Fetch partner ID from request body

    if (!id) {
        return res.status(400).json({ message: 'Partner ID is required.' });
    }

    try {
        const partner = await Partner.findByIdAndDelete(id);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found.' });
        }
        return res.status(200).json({ message: 'Partner deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting partner.' });
    }
});