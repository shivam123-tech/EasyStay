if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const listingRoute = require('./routes/listing.js');
const reviewsRoute = require('./routes/reviews.js');
const userRoute = require("./routes/user.js");
const bookingRoute = require("./routes/booking.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash =require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/Listing.js");


const port = 3000;
app.listen(port,()=>{
    console.log("app is listening");
})

const store= MongoStore.create({
  mongoUrl:process.env.ATLASDB_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on("error",(err)=>{
    console.log("error in mongo session",err);
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.user=req.user;
    next();
})



//Express Route
app.use("/",userRoute);
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/bookings",bookingRoute);


async function main(){

    await mongoose.connect(process.env.ATLASDB_URL);

}
main().then((res)=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})



app.get("/", async (req, res, next) => {
    try {
      const allListings = await Listing.find({});
      res.render("listings/index", { allListings });
    } catch (err) {
      next(err); // passes the error to your error-handling middleware
    }
  });
  
  

app.get("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found"));
})

//error handling
app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"}=err;
    res.status(status).render("./listings/error.ejs",{message});
})