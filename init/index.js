const mongoose=require("mongoose");
const Listing=require("../models/listing");
const initdata=require("./data");


main().then( ()=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const datainit = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data inserted");
}

datainit();