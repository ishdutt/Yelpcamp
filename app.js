var express         =require("express"),
    app             =express(),
    mongoose	    =require("mongoose"),
    flash           =require("connect-flash"),
    passport        =require("passport"),
    LocalStrategy   =require("passport-local"),
    bodyParser      =require("body-parser"),
    methodOverride  =require("method-override"),
    User            =require("./models/user.js"),
    Campground      =require("./models/campgrounds"),
    Comment         =require("./models/comment.js"),
    seedDB          =require("./seeds");
    
var commentRoutes    =require("./routes/comments.js"),
    campgroundRoutes =require("./routes/campgrounds.js"),
    indexRoutes      =require("./routes/index.js");

mongoose.connect("mongodb://localhost/yelp_camp_v10",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();        //seed the database


//Passport Configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.CurrentUser=req.user;
    res.locals.error  =req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started");
});