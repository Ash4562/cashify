// routes/deviceRoutes.js
const express = require('express');
const deviceController = require('../../controller/adminController/PhonetoSellController');
const upload = require('../../config/uploadFile');
// const upload = require('../../config/uploadFile');

const router = express.Router();

router.post('/CreateDevices', upload, deviceController.createDevice);
router.get('/getDevicesUserId/:userId', deviceController.getUserIdDevices);

router.get('/getAllDevices', deviceController.getAllDevices);

router.get('/getIdDevices/:id', deviceController.getDeviceById);

router.put('/UpdateDevices/:id', upload, deviceController.updateDevice);


router.delete('/devices/:id', deviceController.deleteDevice);
module.exports = router;