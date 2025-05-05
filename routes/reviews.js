const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/Listing.js");
const {validateReview,isLogged,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Review
//post review route
router.post("/",isLogged,validateReview ,wrapAsync(reviewController.post));

//Delete review route
router.delete("/:reviewId",isLogged,isReviewAuthor,wrapAsync(reviewController.delete));

module.exports = router;