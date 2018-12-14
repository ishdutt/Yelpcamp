var express=require("express");
var router =express.Router({mergeParams: true});
var Campground = require("../models/campgrounds.js");
var Comment = require("../models/comment.js");
var middleware =require("../middleware");

//New form to add new comment
router.get("/new",middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("comments/new.ejs",{campground:campground})
        }
    })
});

//Creating new comment and adding it to the campground

//find the campground
//create the comment in db
//connect campground with campground
//redirect it somewhere
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,newcomment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comments
                    newcomment.author.id=req.user._id;
                    newcomment.author.username=req.user.username;
                    //save it
                    newcomment.save();
                    console.log(newcomment);
                    //campgrounds association
                    campground.comments.push(newcomment);
                    campground.save();                      //saving the campgrounds (part of campgrounds.create)
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
});


//Editing the comments
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, comment) {
        if(err){
            console.log(err)
        }else{
                res.render("comments/edit.ejs",{campground_id:req.params.id,comment:comment})
        }
    })
});

//Updating the routes
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          console.log(updatedComment);
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});


//Deleting the comments
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    });
})


module.exports = router;