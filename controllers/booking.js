const Booking = require("../models/booking");
const Listing = require("../models/Listing");

module.exports.book= async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    res.render("./bookings/book.ejs", { listing });
}

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body.booking;
  
    try {
      const booking = new Booking({listing: id,user: req.user._id,checkIn:checkIn,checkOut:checkOut, guests:guests});
  
      await booking.save();
  
      req.flash("success", "Booking confirmed!");
      res.redirect(`/bookings/${booking._id}/confirmation`); // You can make a booking details page here
    // res.send("booking confirmed");
    } catch (err) {
      req.flash("error", "Failed to create booking.");
      res.redirect(`/listings/${id}`);
    }
  };

module.exports.bookingConfirm = async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('listing');
    if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('/listings');
    }
    res.render("./bookings/confirmation.ejs", { booking });
  }