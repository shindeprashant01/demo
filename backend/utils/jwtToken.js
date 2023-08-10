// this file create to minimize similar data of response in userController file
const jwt = require("jsonwebtoken");
const { JsonWebToken} = require("jsonwebtoken");


const sendToken=(user,statusCode,res)=>{

    token = user.getJWTToken();

    // options for cookies
    const options ={
        expire :new Date(Date.now + process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
    };

    res.status(statusCode).cookie('token',token,options).json({
        success : true,
        user,
        token,
    });
}

module.exports = sendToken;