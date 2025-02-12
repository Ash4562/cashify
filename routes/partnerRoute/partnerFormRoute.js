const router = require('express').Router()
const partnerProtected = require('../../middleware/partnerProtected');
const partnerFormController = require('../../controller/partnerController/partnerFormController');


router
    .post('/createPartner', partnerFormController.createPartner)  
    .post('/loginPartner', partnerFormController.partnerLogin)  // Partner login
    .post('/verifyPartnerOtp', partnerFormController.verifyOtp)  // OTP verification
    .get('/getPartnerProfile', partnerProtected, partnerFormController.getPartnerProfile)  // Get partner profile
    .put('/updateProfile', partnerProtected, partnerFormController.updatePartnerProfile);  // Update partner profile

module.exports = router;

//demoss