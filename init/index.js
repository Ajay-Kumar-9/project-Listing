const mongoose = require("mongoose");
const data = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connection successfull with db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.insertMany(initData.data);
    console.log("data was initialise");
}
// initDB();


