const router = require('express').Router()
const partnerController = require('../../controller/adminController/partnerController');
const { protectedAdmin } = require('../../middleware/adminProtected');
const partnerProtected  = require('../../middleware/partnerProtected');


router
    .get('/getAllPartners', protectedAdmin, partnerController.getAllPartners)
    .put('/updatePartnerStatus', protectedAdmin, partnerController.updatePartnerStatus)
    .delete('/deletePartner', protectedAdmin,partnerController.deletePartner);
module.exports = router;
