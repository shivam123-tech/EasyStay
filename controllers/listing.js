const Listing = require("../models/Listing");
const Booking = require("../models/booking");

module.exports.index = async (req, res) => {
    const { category,country } = req.query; // get category from query params
    let allListings;
    if(country){
        allListings = await Listing.find({ country: { $regex: `^${country}`, $options: 'i' } }); // case-insensitive search
    }
    else if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }
    res.render("./listings/index.ejs", { allListings });
};

module.exports.new=(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.createListing=async (req,res,next)=>{
   let url = req.file.path;
   let filename = req.file.filename;

    const lists= new Listing(req.body.listing);
    lists.owner=req.user._id;
    lists.image={url,filename}
    await lists.save();
    req.flash("success","New Listings Added");
    res.redirect("/listings");

}

module.exports.show=async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!list){
        req.flash("error","Listing You Requested does not exists");
        res.redirect("/listings");
    }
    res.render("./listings/shows.ejs",{list});
}

module.exports.edit=async (req,res)=>{
    let {id} = req.params;
    let list =await Listing.findById(id);
    // console.log(list);
    if(!list){
        req.flash("error","Listing You Requested does not exists");
        res.redirect("/listings");
    }

    let originalImageUrl = list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");

    res.render("./listings/edit.ejs",{list,originalImageUrl});
}



module.exports.update = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    const { id } = req.params;
    const listData = req.body.listing;

    const onelist = await Listing.findById(id);

    if (!onelist) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    // Update basic fields
    onelist.title = listData.title;
    onelist.description = listData.description;
    onelist.category=listData.category;
    onelist.price = listData.price;
    onelist.location = listData.location;
    onelist.country = listData.country;
    onelist.image.filename = listData.image?.filename || onelist.image.filename;

    // Only update image URL if a new file is uploaded
    if (req.file) {
        onelist.image.url = req.file.path;
        onelist.image.filename = req.file.filename;
    }

    await onelist.save();
    req.flash("success", "Listings Updated");
    res.redirect(`/listings/${id}`);
};


module.exports.delete=async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listings Deleted");
    res.redirect("/listings");
}