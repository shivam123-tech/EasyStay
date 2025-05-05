const Listing=require("../models/Listing");
const Review=require("../models/reviews");


module.exports.post=async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating,comment,createdAt} = req.body.review;
    let newReview = new Review({rating:rating,comment:comment,createdAt:createdAt});
     newReview.author=req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    // console.log(newReview);
    req.flash("success","New Reviews Added");
    res.redirect(`/listings/${id}`);
}

module.exports.delete=async (req,res)=>{
    let{id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Reviews Deleted");
    res.redirect(`/listings/${id}`);
}