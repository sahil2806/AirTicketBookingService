const express = require('express');
const router = express.Router();

const {BookingController} = require('../../controllers/index');

router.post('/bookings',BookingController.create);
router.patch('/bookings/:id',BookingController.update);

module.exports = router;
