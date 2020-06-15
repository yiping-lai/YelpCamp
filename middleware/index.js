var Campground=require("../models/campground");
var Comment=require("../models/comment");
var User=require("../models/user");

// all the middleware goes there
var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that.");
	res.redirect("/login");
}

middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){		
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if (err){				
				res.redirect("back");
			}else{
            if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }									
				//chcek if user owns the camgpround
				// Note: camgpround.author.id is an object not a string
				// need to use method to cmpare to req.user._id
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
						
			}
		});
		
	}else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
	
};



middlewareObj.checkCampgroundOnwership=function(req,res,next){
	if(req.isAuthenticated()){		
		Campground.findById(req.params.id,function(err,campground){
			if (err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
            // check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!campground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }								
				//chcek if user owns the camgpround
				// Note: camgpround.author.id is an object not a string
				// need to use method to cmpare to req.user._id								
				if(campground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
						
			}
		});
		
	}else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
	
}

module.exports=middlewareObj;