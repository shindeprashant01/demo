const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// const { JsonWebToken} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required :[true,"Please enter ypur Name"],
        maxLength :[30 ,"Name can't exceed than 30"],
        minLength :[4,"Name should have more than 5 characters"],
    },
    email:{
        type:String,
        required:[true,"Please enter your Mail"],
        unique :true,
        validate :[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required :[true,"Please Enter Password"],
        minLength :[8,"Password should be grater than eight characters"],
        select:false,
    },
    avatar:{
                     //not take array  bcoz we have one images in that for users
            public_id:{               
             type:String,
             required:true,
            },
            url:{
                type:String,
               required:true
            }
   },
   role:{
    type:String,
    default:"user",

   },
   resetPasswordToken :String,
   resetPasswordExpire : Date,

});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password= await bcrypt.hash(this.password,8 )
}); 
// JWT Token for login after registeration
     userSchema.methods.getJWTToken = function(){
      return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn :process.env.JWT_EXPIRE
      },); 
    
};
 //compare password
    userSchema.methods.comparePassword = async function(enteredPassword){
        return await  bcrypt.compare(enteredPassword,  this.password)
  };

  // generating password reset token

   userSchema.methods.getResetPasswordToken = function(){
    // 1) generating token
           const resetToken = crypto.randomBytes(20).toString("hex");

   // 2)Hadhing and add resetPasswordToken  to userSchema
     this.resetPasswordToken = crypto.createHash("sha256")
     .update(resetToken)
     .digest("hex");

      this.resetPasswordExpire = Date.now()+ 15*60*1000 ;

      return resetToken;

   }


module.exports = mongoose.model("User",userSchema);

