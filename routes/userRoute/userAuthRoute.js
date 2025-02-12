const router = require('express').Router();
const userController = require('../../controller/userController/userAuthController');
const { protected } = require('../../middleware/userAuthMiddleware')

router
    .post('/registerOrLogin', userController.registerOrLogin)
    .post('/verify-otp', userController.verifyOtpForUser)
    .get('/getUser', protected, userController.getUser) 
    .put('/updateUser', protected, userController.updateUser) 
    .delete('/deleteuser', protected, userController.deleteUser)

module.exports = router;
