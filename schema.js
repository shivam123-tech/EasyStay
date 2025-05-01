const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        // image: Joi.string().allow("",null),
        image: Joi.alternatives().try(Joi.string(), Joi.allow(null)),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
        category: Joi.string().valid(
            "Trending","Rooms","Top cities","Islands","Beach",
            "Amazing Pools","Camping","Farms","Desert","Tropical"
        ).required()
    }).required(),
})

// module.exports=listingSchema;

const reviewSchema = Joi.object({
    review: Joi.object({
       rating:Joi.number().required().min(1).max(5),
       comment:Joi.string().required()
    }).required()
});

const bookingSchema = Joi.object({
    booking: Joi.object({
      listing: Joi.string().required(),
      user: Joi.string().required(),
    //   checkIn: Joi.date().required().min('now'),
      checkIn: Joi.date().min(new Date().setHours(0, 0, 0, 0)).required(),
      checkOut: Joi.date().required().greater(Joi.ref('checkIn')),
      guests: Joi.number().required().min(1),
    }).required()
  });
module.exports = { listingSchema, reviewSchema,bookingSchema };