const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new expressError(400, errMsg);
    } else {
      next();
    }
  };



//MAIN ROUTE(Index Route)

router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListing = await Listing.find({});
      res.render("./listings/index.ejs", { allListing });
    })
  );
  
   //NEW ROUTE (render a form to create new lisitng)
  
   router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
  });
  
   //SHOW ROUTE (to show individual data of all listing)
  
   router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if(!listing){
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/listings");
      }
      res.render("./listings/show.ejs", { listing });
    })
  );

  //CREATE ROUTE (to store data in db that comes in req.body);
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      let newListing = new Listing(req.body.listing);
      await newListing.save();
      req.flash("success" , "New listing Created");
      res.redirect("/listings");
    })
  );


    //EDIT ROUTE (to edit listing)
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error" , "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  })
);

//UPDATE ROUTE (to update listing data)

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);

  //DELETE ROUTE (to delete listing);
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success" , "Listing deleted");
      res.redirect("/listings");
    })
  );


 module.exports = router;

 

  
 




  





    
  
    
    
    
