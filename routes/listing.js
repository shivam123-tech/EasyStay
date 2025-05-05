const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing.js");
const Booking = require("../models/booking.js");
const { isLogged, isAuthOwner,validateListing,validateBooking } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })

//index route
router.get("/",wrapAsync(listingController.index));

//New route
router.get("/new",isLogged, listingController.new);

//create route
router.post("/",isLogged,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.createListing));


//show route
router.get("/:id",wrapAsync(listingController.show));

//Edit route
router.get("/:id/edit",isLogged,isAuthOwner,wrapAsync(listingController.edit));


//update route
router.put("/:id",isLogged,isAuthOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.update));

//Delete Route
router.delete("/:id",isLogged,isAuthOwner,wrapAsync(listingController.delete));

module.exports=router;