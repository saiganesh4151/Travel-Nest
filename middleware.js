const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { ListingSchema } = require("./schema");
const {reviewSchema} = require("./schema");

module.exports.isLogged=(req,res,next)=>{
    // console.log(req.originalUrl);
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Pllease login to access !");
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let { id } = req.params;
    let list=await Listing.findById(id);
    if(!list.owner._id.equals(req.user._id))
    {
        req.flash("error","You don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
module.exports.isAuthor=async (req,res,next)=>{
    let { id ,reviewId} = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)) 
    {
        req.flash("error","You don't have permission to delete commnet");
        return res.redirect(`/listing/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
}