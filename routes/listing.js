const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");

const Listing = require("../models/listing");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    validateListing,
    isLoggedin,
    wrapAsync(listingController.createListing)
  );

//NEW ROUTE (render a form to create new lisitng)
router.get("/new", isLoggedin, listingController.renderNewForm);



router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    validateListing,
    isLoggedin,
    isOwner,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;




router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);


module.exports = router;
