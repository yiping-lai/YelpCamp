var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");// will require index.js by default
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


// INDEX -- display all campgrounds
router.get("/",function(req,res){
	if (req.query.search){
		// fuzzy search (g: means global)
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               req.flash("error","Invalid search key");
           } else {
              if(allCampgrounds.length < 1) {
                  req.flash("error","No campground found. Please try again.");
				  return res.redirect("/campgrounds");
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds});
           }
        });	
		
	}else{
		// get all campgrounds from DB
		Campground.find({},function(err,all_campsites){
			if (err){
				req.flash("error","Error. Please try again.");
			}else{	
				res.render("campgrounds/index",{campgrounds:all_campsites});		
			}
		});		
	}

	
});


// NEW --- display form 
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});


// CREATE --- add new data to DB
router.post("/",middleware.isLoggedIn,function(req,res){	
	// get data from form and add data to campgrounds
	var name=req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	var description=req.body.description;
	
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		};
		
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;

		var newCampground={price:price,name:name,image:image,description:description,location: location, lat: lat, lng: lng};
	
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


// EDIT campground 
router.get("/:id/edit",middleware.checkCampgroundOnwership,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		res.render("campgrounds/edit",{campground:campground})
	});
});

// UPDATE campground 
router.put("/:id",middleware.checkCampgroundOnwership,function(req,res){
	
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;

	
		// find and update the correct campground
		Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
			if (err){
				res.redirect("/campgrounds");
			}else{
				res.redirect("/campgrounds/"+req.params.id);
			}
		});
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


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports=router;