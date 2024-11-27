const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { ListingSchema } = require("../schema");
const { isLogged, isOwner ,validateListing } = require('../middleware');
const listingController=require("../controllers/listing");
const multer=require("multer");
const { storage }= require("../cloudConfig");
// const upload=multer({ dest : "uploads/"});
const upload=multer({storage});





//Index Route
router.get("/", wrapAsync(listingController.index));

//New listing form Route
router.get('/new',isLogged,listingController.newListing);



//Show Listing route
router.get('/:id', wrapAsync(listingController.showListing))

// New Listing
router.post('/',upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));
// router.post('/',upload.single("listing[image]"), (req,res)=>{
//     console.log(req.body);
//     res.send(req.file);
// });

//Edit form route
router.get('/:id/edit', isLogged,isOwner,wrapAsync(listingController.editListingForm))

//Update Route
router.put('/:id',isLogged ,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))

//Delete Route
router.delete('/:id', isLogged ,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;
