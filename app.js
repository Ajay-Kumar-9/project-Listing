/* Main file */

//REQUIRE PACKAGES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const {listingSchema} = require("./schema.js");

// MONGO DB SETUP
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connection successfull with db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//setting view engine for ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//HOME ROUTE
app.get("/", (req, res) => {
  res.send("this is the home route");
});

//MAIN ROUTE(Index Route)

app.get("/listings", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
}));

//NEW ROUTE (render a form to create new lisitng)

app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//SHOW ROUTE (to show individual data of all listing)

app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
}));

//CREATE ROUTE (to store data in db that comes in req.body);
app.post("/listings", wrapAsync(async (req, res,next) => {
let result =  listingSchema.validate(req.body);
console.log(result);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
 

//EDIT ROUTE (to edit listing)
app.get("/listings/:id/edit",wrapAsync (async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

//UPDATE ROUTE (to update listing data)

app.put("/listings/:id", wrapAsync(async (req, res) => {
  if(!req.body.listing){
    throw new expressError(400,"Send valid data for listing");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE (to delete listing);
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

//PAGE NOT FOUND ERROR

app.all("*",(req,res,next)=>{
  next(new expressError(404,"page not found"));
});





//MIDDLEWARE(to handle async error)

app.use((err,req,res,next)=>{
  let{status =500 ,message = "Something went wrong"} = err;
 res.status(status).render("error.ejs",{err});
//  res.status(status).send(message);
});






/* TEST ROUTE TO CHECK DB IS WORKING PROPERLY */

// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "new villa",
//     description: "xyz",
//     price: 1200,
//     location: "calangute Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfull testing");
// });

//BASIC SERVER SETUP
app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
