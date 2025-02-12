const express = require('express');
const router = express.Router();
const userAddress = require('../../controller/userController/userAddress');

router.post('/createAdress', userAddress.createAddress);
router.get('/getAllAdress/:userId', userAddress.getAllAddresses);
router.get('/getAddress/:id', userAddress.getAddressById);
router.put('/updateAddress/:id', userAddress.updateAddress);
router.delete('/deleteAdress/:id', userAddress.deleteAddress);

module.exports = router;
