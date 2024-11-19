const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { ListingSchema } = require("../schema");


const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let lists = await Listing.find({});
    res.render('./listings/all.ejs', { lists });
}));

//New Route
router.get('/new', (req, res) => {
    res.render('./listings/new.ejs');
});



//Show route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id).populate("reviews");
    res.render('./listings/show.ejs', { lists });
}))

router.post('/', validateListing, wrapAsync(async (req, res) => {
    // let { newtitle,newdescription,newimage,newprice,newlocation,newcountry }=req.body;
    // let list=await new Listing({
    //     title : newtitle,
    //     description :newdescription,
    //     image : newimage,
    //     price :newprice,
    //     location :newlocation,
    //     country : newcountry
    // });
    if (!req.body.listing) {
        throw new ExpressError(404, "Error occured");
    }
    // let result=ListingSchema.validate(req.body);
    // console.log(result);
    // if(result.error)
    // {
    //     throw new ExpressError(400, result.error);
    // }
    // if (isNaN(price)) {
    //     throw new ExpressError(400, "Error: Price must be a valid number.");
    // }
    let list = new Listing(req.body.listing);
    console.log(list);
    list.save().then(() => {
        console.log("data saved");
    });
    res.redirect('/listing');
}));


router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id);
    res.render('./listings/edit.ejs', { lists })
}))

//Update Route
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(list);
    res.redirect(`/listing/${id}`);
}))

//Delete Route
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    console.log(list);
    res.redirect('/listing');
}));

module.exports=router;
