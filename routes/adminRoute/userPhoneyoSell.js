// routes/deviceRoutes.js
const express = require('express');
const deviceController = require('../../controller/adminController/PhonetoSellController');
const { upload } = require('../../config/cloudinary');

const router = express.Router();

router.post('/CreateDevices', upload.array("images", 5), deviceController.createDevice);
router.get('/getDevicesUserId/:userId', deviceController.getUserIdDevices);

router.get('/getAllDevices', deviceController.getAllDevices);

router.get('/getIdDevices/:id',  upload.array("images", 5), deviceController.getDeviceById);

router.put('/UpdateDevices/:id', deviceController.updateDevice);



router.delete('/devices/:id', deviceController.deleteDevice);
module.exports = router;
// /api/v1/userPhonetoSell/CreateDevices 