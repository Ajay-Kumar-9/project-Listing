const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const allListing = require("./data.js");


// if(process.env.NODE_ENV != "production"){
//   require("dotenv").config();
// }

// console.log(allListing);



const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const { request } = require("express");
const mapToken =
console.log(mapToken);
const geocodingClient = mbxGeoCoding({accessToken: mapToken});





const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connection successfull with db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  for (let listing of allListing) {
    let response = await geocodingClient.forwardGeocode({
      query: listing.geometry,
      limit: 1,
      
     
    }).send(); 
    console.log(allListing);

    listing.geometry = response.body.features[0].geometry;

  }


  



  await Listing.insertMany(updatedData);
  const updatedData = allListing.map((obj) => ({
    ...obj,
    owner: "66740214d208973a010e3232",
  }));

  console.log("Data was initialized");

};


