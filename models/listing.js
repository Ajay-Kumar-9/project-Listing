//BUILDING LISTING SCHEMA STEP1

const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,
  image: {
    type: String,
    default:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) => (v === "" ? "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1892&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D": v),
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
{
   type:Schema.Types.ObjectId,
    ref:"Review"
}
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
   
  
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id: {$in : listing.reviews}});
  }

});








const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
