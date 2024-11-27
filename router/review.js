const express = require("express");
const mongoose = require("mongoose");
const router=express.Router({ mergeParams : true});
const methodOverride = require("method-override");

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema} = require("../schema");
const Review = require("../models/review");
const { isLogged, isOwner ,validateReview ,isAuthor} = require('../middleware');
const reviewController=require("../controllers/review");

//Review Route
//POST
router.post("/", isLogged,validateReview ,wrapAsync(reviewController.addReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLogged,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;