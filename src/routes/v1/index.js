const express = require('express');
const router = express.Router();

const BookingController = require('../../controllers/index');

const bookingController = new BookingController();

router.post('/bookings',bookingController.create); // To create a Booking  flight
router.patch('/bookings/:id',bookingController.update); // To update the details in Booking flight
router.post('/publish',bookingController.sendMessageToQueue); // To publish Message/ mail 

module.exports = router;




