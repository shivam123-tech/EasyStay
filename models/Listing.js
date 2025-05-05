const mongoose = require("mongoose");
const { type } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        type: {
            filename: { type: String},
            url: {
                type: String,
                default: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                // set: (v) => {
                //     if (!v || v.trim() === "") {
                //         return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                //     }
                //     return v;
                // }
            }
        },
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Top cities","Islands","Beach","Amazing Pools","Camping" ,
            "Farms","Desert","Tropical"]
    }
});

//handling: Delete Listing
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;