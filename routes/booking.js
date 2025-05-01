const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing.js");
const Booking = require("../models/booking.js");
const { isLogged, isAuthOwner,validateListing,validateBooking } = require("../middleware.js");

const bookingController = require("../controllers/booking.js");

//booking confirmation route
router.get('/:id/confirmation', isLogged,wrapAsync(bookingController.bookingConfirm));
router.get("/:id/book",isLogged,wrapAsync(bookingController.book));
router.post("/:id/book",isLogged, validateBooking,wrapAsync(bookingController.createBooking));

module.exports=router;