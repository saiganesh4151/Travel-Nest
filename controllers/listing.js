const Listing = require("../models/listing");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken : mapToken});
// link for forward and backward geocoding --> https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode-1


module.exports.index = async (req, res) => {
    let lists = await Listing.find({});
    res.render('./listings/all.ejs', { lists });
};

module.exports.newListing = (req, res) => {
    res.render('./listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate({ path: "owner" });
    if (!lists) {
        req.flash("error", "Listing does not exist !");
        res.redirect('/listing');
    }
    res.render('./listings/show.ejs', { lists });
};

module.exports.createListing = async (req, res) => {
    // let { newtitle,newdescription,newimage,newprice,newlocation,newcountry }=req.body;
    // let list=await new Listing({
    //     title : newtitle,
    //     description :newdescription,
    //     image : newimage,
    //     price :newprice,
    //     location :newlocation,
    //     country : newcountry
    // });
    // let result=ListingSchema.validate(req.body);
    // console.log(result);
    // if(result.error)
    // {
    //     throw new ExpressError(400, result.error);
    // }
    // if (isNaN(price)) {
    //     throw new ExpressError(400, "Error: Price must be a valid number.");
    // }

    let response= await geocodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1
    }).send();
    // console.log(listing.location);
    // console.log(response.body.features[0].geometry); // To find the coordinates we use this ..


    if (!req.body.listing) {
        throw new ExpressError(404, "Error occured");
    }
    let url=req.file.path;
    let filename = req.file.filename;
    let list = new Listing(req.body.listing);
    list.owner = req.user;
    list.image= { url , filename};
    // console.log(list);

    list.geometry=response.body.features[0].geometry;

    await list.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listing');
};


module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id);
    if (!lists) {
        req.flash("error", "Listing does not exist !");
        return res.redirect('/listing');
    }
    // let response= await geocodingClient.forwardGeocode({
    //     query : req.body.listing.location,
    //     limit : 1
    // }).send();
    // lists.geometry=response.body.features[0].geometry;
    // console.log(lists.location);
    // console.log(lists.geometry);
    let originalImageUrl = lists.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250");
    res.render('./listings/edit.ejs', { lists , originalImageUrl})
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // console.log(req.body.listing.location);
    let response= await geocodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1
    }).send();
    listing.geometry=response.body.features[0].geometry;
    // console.log(listing.geometry);
    if(typeof req.file != undefined && req.file)
        {
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image ={ url , filename};
            await listing.save();
        }
    req.flash("success", "Listing Updated");
    // res.redirect(`/listing/${id}`);
    res.render("./listings/show.ejs",{lists : listing});
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success", "Listing Deleted");
    res.redirect('/listing');
};