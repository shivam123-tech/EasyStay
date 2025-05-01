const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require("../models/user.js");
const passport = require('passport');
const { saveUrl } = require('../middleware.js');

const userController = require("../controllers/user.js");

router.get("/signup",userController.getSingup)
router.post("/signup",wrapAsync(userController.postSignup));

router.get("/login",userController.getLogin);

router.post("/login",saveUrl,
    passport.authenticate('local', {
     failureRedirect: '/login',failureFlash:true 
    }),
    userController.postLogin
)

router.get("/logout",userController.logout);

module.exports=router;