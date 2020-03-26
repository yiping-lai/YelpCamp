var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var Campground=require("../models/campground");
var Comment=require("../models/comment");
//==============================
// AUTH ROUTES
//==============================

// root route
router.get("/",function(req,res){
	res.render("landing");
})


// register from
router.get("/register",function(req,res){
	res.render("register");
});


// handle sign up logic
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username,email:req.body.email,avatar:req.body.avatar});
	if(req.body.admincode==="secretcode123"){
		newUser.isAdmin=true
	}
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);			
			return res.redirect("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+newUser.username)
			res.redirect("/campgrounds");
		});
	});
});


// show login form
router.get("/login",function(req,res){
	res.render("login");
});

// handling login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged You Out.");
	res.redirect("/campgrounds");
});


// USER PROFILS
router.get("/users/:id",function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err){
			req.flash("error",err.message);
			return res.redirect("back");
		}
		Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
			if(err){
				req.flash("error",err.message);
				return res.redirect("back");				
			}
			Comment.find().where("author.id").equals(foundUser._id).exec(function(err,comments){
				if (err){
					req.flash("error",err.message);
					return res.redirect("back");				
				}
				res.render("users/show",{user:foundUser,campgrounds:campgrounds,comments:comments});
			});
		});
		
	});
});

router.get("/users",function(req,res){
	// get all campgrounds from DB
	User.find({},function(err,all_users){
		if (err){
			req.flash("error",err.message);
			return res.redirect("back");	
		}else{	
			res.render("users/index",{users:all_users});		
		}
	});
})

module.exports=router;