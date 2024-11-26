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


//Review Route
//POST
router.post("/", isLogged,validateReview ,wrapAsync(async (req, res) => {

    let listing= await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","New Review Created");
    console.log(listing);
    res.redirect(`/listing/${ listing._id}`);
    // if (!listing.reviews) {
    //     listing.reviews = []; // Initialize as an empty array if not already defined
    // }
}));
//DELETE REVIEW ROUTE

router.delete("/:reviewId",isLogged,isAuthor,wrapAsync( async(req,res)=>{
    let { id , reviewId}=req.params;
    await Listing.findOneAndUpdate({ _id: id },{ $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listing/${ id }`);
}))

module.exports=router;