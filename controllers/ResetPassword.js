const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//  reset password Token 

exports.resetPasswordToken = async (req, res) => {
   try{
     // get email from body

     const  email  = req.body.email;

     // check user for this email, email valdation
 
     const User = await User.findOne({email:email});
     if(!User){
         return res.status(401).json({
             success:false,
             message:"your email not registered with us", })
     }
     // genreate token 
 
     const token = crypto.randomUUID();
     // update user by adding token and expiration time
 
     const updatedDetails = await User.findByIdAndUpdate(
         {email:email},
         {
             token:token,
             resetPasswordExpire:Date.now() + 5 * 60 * 1000, // 10 minutes
         },
         {
             new:true,
             
         });
 
     
     // create url
       const url = `http://localhost:3000/update-Password/${token}`
     // send Email containing url
 
     await mailSender(email,
         " Password reset Link",
         `password reset Link: ${url}`);
     // ṛeturn response
 
     return res.status(200).json({
         success:true,
         message:"Email sent successfully, please check email and change password",
     });
 

   }catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"something went wrong while sending  reset pwd mail",
    })
   }

}
  
//  reset password

exports.resetPassword = async (req, res) => {
   try{
     // data fetch 

     const {token, password, confirmPassword} = req.body;
     // validation
 
     if(password !== confirmPassword){
         return res.status(401).json({
             success:false,
             message:"password and confirm password do not match",
         })
     } 
     // get userdetails  from db using token
 
     const userdetails = await User.findOne({token:token});
     //  if no entry - token invalid
 
     if(!userdetails){
         return res.json({
             success:false,
             message:"token is invalid",
         })
     }
     // token time check
 
     if(userdetails.resetPasswordExpire > Date.now()){
         return res.json({
             success:false,
             message:"token is expired",
         })
     }
     // hash password
 
     const hashedPassword = await bcrypt.hash(password, 10);
     // password update
 
     await User.findByIdAndUpdate(
         {token:token},
         {password:hashedPassword},
         {new:true}
     );
     // return response
 
     return res.status(200).json({
         success:true,
         message:"password reset successfully",
     })

   }catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:"something went wrong while updating password",
    })
   }
}

