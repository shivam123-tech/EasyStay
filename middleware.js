// middleware.js
const Listing = require("./models/Listing");
const Review = require("./models/reviews.js");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")
const {reviewSchema,bookingSchema} = require("./schema.js");
const Booking = require("./models/booking.js");

function isLogged(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
}

function saveUrl(req, res, next) {
  if (req.session.redirectUrl) {
    res.locals.redirectUl = req.session.redirectUrl;
  }
  next();
}

//Authorization for Listings
async function isAuthOwner(req, res, next) {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.user._id)) {
    req.flash("error", "You are not owner of this listings");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//Authorization for Reviews
async function isReviewAuthor(req,res,next) {
  let{id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.user._id)){
    req.flash("error","You are not author of this review");
   return res.redirect(`/listings/${id}`);
  }
  next();
}

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
  } else{
      next();
  }
}


const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
  } else{
      next();
  }
}

const validateBooking = (req, res, next) => {
  const { checkIn, checkOut, guests } = req.body.booking;

  // Ensure all required fields are present
  if (!checkIn || !checkOut || !guests) {
    req.flash("error", "All fields are required.");
    return res.redirect(`/listings/${req.params.id}/book`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to 00:00:00 today

  const checkInDate = new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0); // normalize input too

  const checkOutDate = new Date(checkOut);
  checkOutDate.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    req.flash("error", "Check-in date must be today or in the future.");
    return res.redirect(`/listings/${req.params.id}/book`);
  }

  if (checkOutDate <= checkInDate) {
    req.flash("error", "Check-out date must be after the check-in date.");
    return res.redirect(`/listings/${req.params.id}/book`);
  }

  if (guests < 1) {
    req.flash("error", "Number of guests must be at least 1.");
    return res.redirect(`/listings/${req.params.id}/book`);
  }

  next();
};


// Export all together
module.exports = {
  isLogged,
  saveUrl,
  isAuthOwner,
  validateListing,
  validateReview,
  isReviewAuthor,
  validateBooking
};
