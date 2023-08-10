const ErrorHander = require("../utils/errorHander");
const catchAsycError = require("./catchAsycError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAthenticatedUser = catchAsycError(async(req,res,next)=>{

    const{ token }= req.cookies;

    if(!token){
        next(new ErrorHander("Please login to access this resourse",401))
    }

    const decodedDate = jwt.verify(token,process.env.JWT_SECRET);

   req.user =  await User.findById(decodedDate.id);

   next();

});

exports.authorizeRoles= (...roles)=>{

    return(req,res,next)=>{

        if(!roles.includes(req.user.role)){

       return next( new ErrorHander(`Role : ${req.user.role}
        is not allowed to access this resource`,403))
        }
        
        next();
    }
}
