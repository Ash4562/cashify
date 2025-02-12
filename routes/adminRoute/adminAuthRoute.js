const router = require('express').Router()
const adminController = require('../../controller/adminController/adminAuthController');
const { protectedAdmin } = require('../../middleware/adminProtected');


router
    .post('/adminRegister', adminController.registerAdmin)
    .post('/adminLogin', adminController.loginAdmin)
    .post('/adminVerifyOtp', adminController.verifyOTP)
    .post('/logoutAdmin', protectedAdmin, adminController.logoutAdmin)
    .get('/adminProfile', protectedAdmin, adminController.getAdminProfile)

module.exports = router;
