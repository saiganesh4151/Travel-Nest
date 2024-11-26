const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initdata = require("./data");


main().then(() => {
    console.log("connection succesful");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const datainit = async () => {
    await Listing.deleteMany({});
    
    // Map and transform the data to include the owner field
    const dataWithOwner = initdata.data.map((obj) => ({ 
        ...obj, 
        owner: '67457cb4a3b5da99057cd0da' 
    }));

    // Insert the transformed data
    await Listing.insertMany(dataWithOwner);
    console.log("Data inserted with owner field");
};

datainit();