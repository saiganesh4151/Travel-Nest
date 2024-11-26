const express = require("express");
const mongoose = require("mongoose");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport= require("passport");
const {saveRedirectUrl}=require("../middleware");

router.get("/signup", (req, res) => {
    res.render('../views/users/signup.ejs');
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success", "User Registered Successfully");
            res.redirect("/listing");
        })
    }
    catch (e) {
        // console.log(e.message);
        req.flash("error", e.message)
        res.redirect('/signup');
    }
}));

router.get("/login", (req, res) => {
    res.render('../views/users/login.ejs');
});

router.post("/login",saveRedirectUrl,
    passport.authenticate(
        "local",
        { failureRedirect: '/login' , failureFlash: true},),
    async (req, res) => {
        req.flash("success","You are Logged in successfully !");
        if(!res.locals.redirectUrl)
        {
            return res.redirect('/listing');
        }
        res.redirect(res.locals.redirectUrl);
    }
);

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged Out Successfully!");
        res.redirect('/listing');
    })
});

module.exports = router;