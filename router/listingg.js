const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { ListingSchema } = require("../schema");
const { isLogged, isOwner ,validateListing } = require('../middleware');




//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let lists = await Listing.find({});
    res.render('./listings/all.ejs', { lists });
}));

//New Route
router.get('/new',isLogged,(req, res) => {
    res.render('./listings/new.ejs');
});



//Show route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id).populate({path :"reviews",populate : { path : "author"}}).populate({path :"owner"});
    console.log(lists);
    if(!lists)
        {
            req.flash("error","Listing does not exist !");
            res.redirect('/listing');
        }
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
    list.owner=res.locals.currUser;
    list.save().then(() => {
        console.log("data saved");
    });
    req.flash("success","New Listing Created");
    res.redirect('/listing');
}));


router.get('/:id/edit', isLogged,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id);
    if(!lists)
        {
            req.flash("error","Listing does not exist !");
            return res.redirect('/listing');
        }
    res.render('./listings/edit.ejs', { lists })
}))

//Update Route
router.put('/:id',isLogged ,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
}))

//Delete Route
router.delete('/:id', isLogged ,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success","Listing Deleted");
    res.redirect('/listing');
}));

module.exports=router;
