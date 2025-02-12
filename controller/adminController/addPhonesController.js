const cloudinary = require('../../config/cloudinary');
const Phone = require('../../models/adminModel/Phone');
const asyncHandler = require('express-async-handler');

exports.addPhone = asyncHandler(async (req, res) => {
    try {
            
        console.log("Request body:", req.body);
        console.log("Uploaded files:", req.files);

        const { phoneName, phone_id, brand, model, price, description, variants } = req.body;
        const logo = req.file ? req.file.path : null;

        if (!req.admin || req.admin.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add a phone' });
        }

        if (!phoneName || !phone_id || !brand || !model || !price || !description || !variants) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }


        const existingPhone = await Phone.findOne({ phone_id });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone with this phone_id already exists.' });
        }


        let parsedVariants = [];
        if (typeof variants === 'string') {
            try {
                parsedVariants = JSON.parse(variants);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid JSON format for variants.' });
            }
        } else if (Array.isArray(variants)) {
            parsedVariants = variants;
        } else {
            return res.status(400).json({ message: 'Variants must be an array.' });
        }


        let uploadedLogo = "";
        if (logo) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(logo, {
                    folder: 'phone_logos',
                    use_filename: true,
                    unique_filename: false,
                });
                uploadedLogo = cloudinaryResponse.secure_url;
            } catch (error) {
                console.error("Error uploading logo:", error);
                return res.status(500).json({ message: "Failed to upload logo." });
            }
        }

      
        let uploadedFiles = {};
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                if (!file.path) continue;

                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
                        folder: 'phone_images',
                        use_filename: true,
                        unique_filename: false,
                    });

                    uploadedFiles[file.fieldname] = cloudinaryResponse.secure_url;
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            }
        }

        
        const updatedVariants = parsedVariants.map((variant) => {
            if (!Array.isArray(variant.colors)) return variant;

            variant.colors = variant.colors.map((color) => {
                if (!Array.isArray(color.images)) {
                    color.images = [];
                }

                const updatedImages = color.images.map((image) => ({
                    original: uploadedFiles[image.original] || image.original || "",
                    smallSize: uploadedFiles[image.smallSize] || image.smallSize || "",
                    zoomImage: uploadedFiles[image.zoomImage] || image.zoomImage || "",
                }));

                if (updatedImages.length === 0 && Object.keys(uploadedFiles).length > 0) {
                    updatedImages.push({
                        original: Object.values(uploadedFiles)[0],
                        smallSize: Object.values(uploadedFiles)[0],
                        zoomImage: Object.values(uploadedFiles)[0],
                    });
                }

                color.images = updatedImages;
                return color;
            });

            return variant;
        });

    
        const newPhone = await Phone.create({
            phoneName,
            phone_id,
            brand,
            model,
            price,
            logo: uploadedLogo,
            description,
            variants: updatedVariants,
            added_by: req.admin._id,
        });

        res.status(201).json({ message: 'Phone added successfully', phone: newPhone });
    } catch (error) {
        console.error('Error adding phone:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



exports.getAllPhones = asyncHandler(async (req, res) => {
    try {
        const phones = await Phone.find();
        res.status(200).json({
            message: 'Phones retrieved successfully',
            phones,
        });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to retrieve phones');
    }
});

// exports.getPhone = asyncHandler(async (req, res) => {
//     const { phone_id } = req.body;

//     try {
//         const phone = await Phone.findOne({ phone_id });
//         if (!phone) {
//             res.status(404);
//             throw new Error('Phone not found');
//         }
//         res.status(200).json({
//             message: 'Phone retrieved successfully',
//             phone,
//         });
//     } catch (error) {
//         res.status(500);
//         throw new Error('Failed to retrieve phone');
//     }
// });

exports.getPhone = asyncHandler(async (req, res) => {
    const { phone_id } = req.params; 

    try {
        const phone = await Phone.findOne({ phone_id });

        if (!phone) {
            res.status(404).json({ message: "Phone not found" });
            return; 
        }
        

        res.status(200).json({
            message: "Phone retrieved successfully",
            phone,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve phone", error: error.message });
    }
});


// exports.getPhonesByBrand = asyncHandler(async (req, res) => {
//     try {
//         const { brand } = req.body; // Body se brand extract kar rahe hain
//         if (!brand) {
//             return res.status(400).json({ message: "Brand is required" });
//         }

//         const phones = await Phone.find({ brand });

//         res.status(200).json({
//             message: `Phones for brand ${brand} retrieved successfully`,
//             phones,
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching phones", error: error.message });
//     }
// });


exports.getPhonesByBrand = asyncHandler(async (req, res) => {
    try {
        const { brand } = req.params // URL se brand le raha hai
        const phones = await Phone.find({ brand });
        res.status(200).json({
            message: `Phones for brand ${brand} retrieved successfully`,
            phones,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching phones' });
    }
});


exports.updatePhone = asyncHandler(async (req, res) => {
    try {
        const { phoneName, phone_id, brand, model, price, description, variants } = req.body;

        if (!req.admin || req.admin.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add a phone' });
        }

        if (!phoneName || !phone_id || !brand || !model || !price || !description || !variants) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const existingPhone = await Phone.findOne({ phone_id });

        if (!existingPhone) {
            return res.status(404).json({ message: 'Phone with this phone_id does not exist.' });
        }

        let parsedVariants = [];
        if (typeof variants === 'string') {
            try {
                parsedVariants = JSON.parse(variants);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid JSON format for variants.' });
            }
        } else if (Array.isArray(variants)) {
            parsedVariants = variants;
        } else {
            return res.status(400).json({ message: 'Variants must be an array.' });
        }

        let uploadedFiles = {};
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
                    folder: 'phone_images',
                    use_filename: true,
                    unique_filename: false,
                });

                uploadedFiles[file.fieldname] = cloudinaryResponse.secure_url;
            }
        }

        const updatedVariants = parsedVariants.map((variant) => {
            if (!Array.isArray(variant.colors)) return variant;

            variant.colors = variant.colors.map((color) => {
                if (!Array.isArray(color.images)) {
                    color.images = [];
                }

                const updatedImages = color.images.map((image) => ({
                    original: uploadedFiles[image.original] || image.original || "",
                    smallSize: uploadedFiles[image.smallSize] || image.smallSize || "",
                    zoomImage: uploadedFiles[image.zoomImage] || image.zoomImage || "",
                }));

                if (updatedImages.length === 0 && Object.keys(uploadedFiles).length > 0) {
                    updatedImages.push({
                        original: Object.values(uploadedFiles)[0],
                        smallSize: Object.values(uploadedFiles)[0],
                        zoomImage: Object.values(uploadedFiles)[0],
                    });
                }

                color.images = updatedImages;
                return color;
            });

            return variant;
        });

        const updatedPhone = await Phone.findOneAndUpdate(
            { phone_id }, 
            {
                phoneName,
                brand,
                model,
                price,
                description,
                variants: updatedVariants,
            },
            { new: true }
        );

        if (!updatedPhone) {
            return res.status(500).json({ message: 'Failed to update phone.' });
        }

        res.status(200).json({ message: 'Phone updated successfully', phone: updatedPhone });
    } catch (error) {
        console.error('Error updating phone:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


exports.deletePhone = asyncHandler(async (req, res) => {
    const { phone_id } = req.body;

    if (!req.admin || req.admin.role !== 'admin') {
        res.status(403).json({ message: 'Not authorized to delete a phone' });
        return;
    }

    try {
        const phoneToDelete = await Phone.findOneAndDelete({ phone_id });

        if (!phoneToDelete) {
            res.status(404).json({ message: 'Phone not found' });
            return;
        }

        res.status(200).json({
            message: 'Phone deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete phone', error: error.message });
    }
});

