const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview=async (req, res) => {

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
};

module.exports.deleteReview=async(req,res)=>{
    let { id , reviewId}=req.params;
    await Listing.findOneAndUpdate({ _id: id },{ $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listing/${ id }`);
};
module.exports
module.exports