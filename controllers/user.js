const User = require("../models/user");

module.exports.getSingup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignup=async (req,res)=>{

    try{
     let {username,email,password} = req.body;
    const newUser = new User({username:username,email:email});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
   //Automatically Login after Signup
    req.login(registerUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to EasyStay!");
        res.redirect("/listings");
    })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin=async (req,res)=>{
    req.flash("success","Welcome back to EasyStay");
    if(res.locals.redirectUl){
  return  res.redirect(res.locals.redirectUl);
    }
    res.redirect("/listings");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","Logged you out!");
      res.redirect("/listings");
    })
 }