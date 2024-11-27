const express = require("express");
const mongoose = require("mongoose");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport= require("passport");
const {saveRedirectUrl}=require("../middleware");
const userController=require("../controllers/user");

//signup form
router.get("/signup", userController.renderSignup);

//signup
router.post("/signup", wrapAsync(userController.signup));

//login form
router.get("/login",userController.renderLogin);

//login
router.post("/login",saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login' , failureFlash: true},),userController.login);

//logout
router.get("/logout",userController.logout);

module.exports = router;