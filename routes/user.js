const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup",(req,res)=>{
res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser= ({email,username});
         const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success", "User registered successfully");
    res.redirect("/listings");
    }catch(e){
      req.flash("error", e.message);
      res.redirect("/SignUp");
    }
   
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", (req,res,next)=>{console.log("hello");next();},passport.authenticate("local", {failureRedirect:"/login", failureFlash : true}),wrapAsync(async(req,res,next)=>{
    req.flash("Welcome  back to wanderlust!");
    res.redirect("/listings");
    

}));

module.exports = router;