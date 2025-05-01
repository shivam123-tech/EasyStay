const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ref } = require("joi");
const User =require("./user");
const Listing = require("./Listing");
const bookingSchema = new mongoose.Schema({
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing', // Reference to the Listing model
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model   
      required: true
    },
    checkIn: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to 00:00:00
          return value >= today;
        },
        message: 'Check-in date cannot be in the past.'
      }
    },
    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value > this.checkIn; // Ensure check-out date is after check-in date
        },
        message: 'Check-out date must be after check-in date.'
      }
    },
    guests: {
      type: Number,
      required: true,
      min: 1, // At least 1 guest
    }
  }, { timestamps: true });
  
  // Create the model for Mongoose
  const Booking = mongoose.model('Booking', bookingSchema);
 module.exports=Booking;