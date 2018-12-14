var express=require("express");
var router =express.Router();
var Campground = require("../models/campgrounds.js");
var middleware =require("../middleware");


//========================Index show all campgrounds================================
router.get("/",function(req,res){
    Campground.find({},function(err,allcampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index" ,{campgrounds:allcampground,CurrentUser:req.user});
        }
    })
    
})

//=====================Create new campgrounds===============================
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author  =   {
        id: req.user._id,
        username: req.user.username
    };
    var newcampgrounds={name:name,image:image,description:desc,author:author};
    //addding to db
    Campground.create(newcampgrounds,function(err,newly)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(newly);
            res.redirect("/")
        }
    })
    
});


//=====================New-show form to create new campgrounds=================================
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new.ejs");
})


//=====================Show-discription of a campground========================
router.get("/:id",function(req, res) {
    //find the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err,found){
        if(err){
            console.log(err);
        } else{
                //render template with that campgrond
                console.log(found);
            res.render("campgrounds/show.ejs",{campground : found})
        }
    });
});

//=================Edit Route==================================
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/edit.ejs",{campground:campground});
        }
    })
});

//================Campgrounds Update=============
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err,updatedCampground){
       if(err){
           console.log(err);
       } else{
           res.redirect("/campgrounds/"+ req.params.id)
       }
    });
});


//===============Delete Campgrounds================
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds")
        }
    });
})


module.exports = router;