var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");// will require index.js by default

// INDEX -- display all campgrounds
router.get("/",function(req,res){
	// get all campgrounds from DB
	Campground.find({},function(err,all_campsites){
		if (err){
			console.log(err);
		}else{	
			// code cleaned up
			//res.render("campgrounds/index",{campgrounds:all_campsites,currentUser:req.user});		
			res.render("campgrounds/index",{campgrounds:all_campsites});		
		}
	});
	
});


// NEW --- display form 
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});


// add new data to DB
router.post("/",middleware.isLoggedIn,function(req,res){	
	// get data from form and add data to campgrounds
	var name=req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	var description=req.body.description;
	var newCampground={price:price,name:name,image:image,description:description};
	
	// create a new campground and save to DB
	Campground.create(newCampground,function(err,newlyCreated){
		if (err){
			res.redirect("back");
		}else{
			newlyCreated.author.username=req.user.username
			newlyCreated.author.id=req.user._id
			newlyCreated.save();
			// redirect to campground pages
			res.redirect("/campgrounds");			
		}
	});
});

// SHOW - shows more info about one campground
router.get("/:id",function(req,res){
		Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
			if (err){
				console.log("Error in show route.");
			}else{
				res.render("campgrounds/show",{campground:foundCampground});		
			}
		});
		
});

// EDIT campground route
router.get("/:id/edit",middleware.checkCampgroundOnwership,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		res.render("campgrounds/edit",{campground:campground})
	});
});


// UPDATE campground route
router.put("/:id",middleware.checkCampgroundOnwership,function(req,res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if (err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// DETROY campground route
router.delete("/:id",middleware.checkCampgroundOnwership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}else{
			req.flash("success","Campground deleted");
			res.redirect("/campgrounds");
		}
	})
});


module.exports=router;