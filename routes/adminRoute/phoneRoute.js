const router = require('express').Router();
const upload = require('../../config/multerConfig');
const addPhonesController = require('../../controller/adminController/addPhonesController');
const { protectedAdmin } = require('../../middleware/adminProtected');


router
    .post('/add-phones', protectedAdmin, addPhonesController.addPhone)
    .get('/get-all-phones', addPhonesController.getAllPhones)
    .get('/getsinglephone/:phone_id', protectedAdmin, addPhonesController.getPhone)
    .get('/getPhoneByBrand/:brand', addPhonesController.getPhonesByBrand)
    .put('/update-phone', protectedAdmin, upload.any(), addPhonesController.updatePhone) // Make sure to use upload.any() for file uploads
    .delete('/delete-phone', protectedAdmin, addPhonesController.deletePhone);

module.exports = router;
// /api/v1/phone/get-all-phones   
// /api/v1/phone/getPhoneByBrand/:brand