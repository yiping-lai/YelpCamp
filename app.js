var express=require("express");
//var request=require("request");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var flash=require("connect-flash");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
//var seedDB=require("./seed");


var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes=require("./routes/index");


var app=express();

console.log(process.env.DEVELOPER);

console.log(process.env.DEVELOPER,process.env.DEVELOPER==='1');
if (process.env.DEVELOPER==='1'){
	console.log("developer mode");
	mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', { useNewUrlParser: true }); 
}else{
	console.log("user mode");
	mongoose.connect("mongodb+srv://yiping:hualienperson@cluster0-nncjo.mongodb.net/yelp_camp?retryWrites=true&w=majority");
}
//mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://yiping:hualienperson@cluster0-nncjo.mongodb.net/yelp_camp?retryWrites=true&w=majority");
//mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', { useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Best super website ever",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// add this as middleware for every route
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

// requiring ruotes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


if (process.env.DEVELOPER==='1'){
	app.listen(3000, function() { 
		console.log('Server listening on port 3000'); 
	});
}else{
	app.listen(process.env.PORT, process.env.IP, function(){
  		console.log('Server listening on port 3000'); 
	});
};
