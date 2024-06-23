const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErr = require("./catchAsyncErr");
const jwt=require("jsonwebtoken");
const User=require("../model/userModel");

exports.isAuthenticationUser=catchAsyncErr(async(req,res,next)=>{
    const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      
    return next(new ErrorHandler("Please Login & Access the resources", 401));
  }

  const token = authHeader.split(" ")[1];
 console.log("Token:", token);
      if(!token){
           return next(new ErrorHandler("Please Login & Access the resources",401))
        }
       
 const decodeData=await jwt.verify(token,process.env.JWT_SECRET)
 req.user=await User.findById(decodeData.id);
    console.log("Auth-->",req.user)
  next();
});
 exports.authorizeRoles=(...roles)=>{
     return (req,res,next)=>{
         if(!roles.includes(req.user.role)){
             return next(
             new ErrorHandler(`Role: ${req.user.role}  is not allowed to access this resources`,403)
             );
         }
         next();
     }
     
 }
