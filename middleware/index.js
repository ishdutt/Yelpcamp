var Campground=require("../models/campgrounds.js");
var Comment=require("../models/comment.js");

var middlewareObj={};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        //if currentuser is equal to author
        Campground.findById(req.params.id,function(err,foundcampground){
            console.log(req.user.id);
                if(foundcampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
        })
    }else{
        //not signed in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        //if currentuser is equal to author
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            console.log(req.user.id);
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
        })
    }else{
        //not signed in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


module.exports = middlewareObj;