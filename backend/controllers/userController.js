const ErrorHander = require("../utils/errorHander");
const catchAsycError = require("../middleware/catchAsycError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require ("../utils/sendEmail");
const crypto = require("crypto");

//register user process will be done here
exports.registerUser = catchAsycError(async(req,res,next)=>{

   const{name,email,password} =req.body;

   const user = await User.create({
    name,email,password,
    avatar:{
        public_id : "this is sample id",
        url:"profilepicUrl",
    },
   });
   sendToken(user , 201 , res);
  //    token = user.getJWTToken();

  //  res.status(201).json({
  //    success:true,
  //   token,
   
  
  // let jwtSecretKey = process.env.JWT_SECRET_KEY;
  // let data = {
  //     time: Date(),
  //     userId: 12,
  // }

  // const token = jwt.sign(data, jwtSecretKey);

  // res.send(token);


});

//login user

exports.loginUser=catchAsycError(async(req,res,next)=>{

    const {email,password}= req.body;

   // for user enter both email and password detail
    if(!email || !password){
        return next(new ErrorHander("Please enter Email & Password",400)) 
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid Email or Password",401));

    }

    const isPasswordMatched = await user.comparePassword(password);

  if(!isPasswordMatched){
    return next(new ErrorHander("Invalid Email or Password",401));
  }
  // const  token = user.getJWTToken();

  sendToken(user, 200, res);
 
})

//for logout user

exports.logoutUser = catchAsycError(async(req,res,next)=>{
    
     res.cookie("token",null,{
      expires : new Date (Date.now()),
      httpOnly : true,
     })
       

  res.status(200).json({
    success : true,
    message : "Logout Sccussfully"
  })

});

// forgot password
 exports.forgotPassword = catchAsycError(async(req,res,next)=>{

   const user = await User.findOne({email :req.body.email});

   if(!user){
    return next(new ErrorHander("User not found",404))
   }
   // get resetPasswordToken
    const resetToken = user.getResetPasswordToken();
    
    await user.save({validateBeforeSave : false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message =  `Your Password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested
    this email,then Please ignore it`;

    try {

      await sendEmail ({
       email : user.email ,
       subject : `Ecommerce Password Recovery`,
       message,

      });

      res.status(200).json({
        success :true,
        message : `Email send to ${user.email} Successfully` ,
      })
      
    } catch (error) {
       user.resetPasswordToken = undefined ; 
       user.resetPasswordExpire = undefined ;
        
       await user.save({validateBeforeSave : false});

       return next(new ErrorHander(error.message,500));
    }

 })

 // reset password

 exports.resetPassword = catchAsycError(async(req,res,next)=>{

  const resetPasswordToken = crypto.createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt : Date.now()},

  });
  if(!user){
    return next(new ErrorHander("Reset Password Token is Invalid or has been expired",400))
   }

   if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHander("Password doesn't Matched", 400))
   }

   user.password = req.body.password;
   user.resetPasswordToken = undefined ; 
   user.resetPasswordExpire = undefined ;

    await  user.save();
   sendToken(user, 200, res);
 });

 // get user details
 exports.getUserDetails= catchAsycError(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success:true,
      user
    })

 });

 //update Password

 exports.updatePassword = catchAsycError(async(req,res,next)=>{

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new ErrorHander("Old Password is Incorrect",401));
  }
 
  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHander("Password doesn't Matched",401));
  }

  user.password = req.body.newPassword;
  await user.save();

 sendToken(user, 200, res)
 });

 //update user profile
 exports.updateProfile = catchAsycError(async(req,res,next)=>{

  const newUserData = {
    name : req.body.name,
    email :req.body.email,
  }

  const user =await User.findByIdAndUpdate(req.user.id ,newUserData,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
 
  res.status(200).json({
    success:true,
    user,
  });
 });

 // get all users --admin

 exports.getAllUsers = catchAsycError(async(req,res,next)=>{

  const users = await User.find();
  
  
  res.status(200).json({
    success : true, 
    users,
  })
});

// get single user -- admin
 exports.getSingleUser = catchAsycError(async(req,res,next)=>{

const user = await User.findById(req.params.id);

if(!user){
  return next(new ErrorHander(`User does not exist with ID:${req.params.id}`))
}

res.status(200).json({
  success : true, 
  user,
});
 });

// user update role -- admin
exports.updateUserRole = catchAsycError(async(req,res,next)=>{

  const newUserData = {
    name : req.body.name,
    email :req.body.email,
    role:req.body.role,
  }

  const user =await User.findByIdAndUpdate(req.params.id ,newUserData,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  if(!user){
    return next(new ErrorHander(`User doen not exist with ID : ${req.params.id}`,400))
  }
 
  res.status(200).json({
    success:true,
    user,
  });
 });

 // delete user -- admin
 exports.deleteUser = catchAsycError(async(req,res,next)=>{

 
  const user =await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHander(`User doen not exist with ID : ${req.params.id}`,400))
  }

  await user.remove();
  res.status(200).json({
    success:true,
    message : "User Deleted Succcessfully."
  
  });
 });