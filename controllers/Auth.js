const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



exports.sendOTP = async (req, res) => {
    try{
        // fetch email from request ki body
    const {email} = req.body;
    // check if user already exists 
    const checkUserPresent = await User.findOne({email});
    // if user already exists then return response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered",
        });
    }
    // generate OTP
    let otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets:false, 
         specialChars: false });

         console.log("OTP is ", otp);

        //  check unique otp or not 
        const result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets:false, 
                specialChars: false }); 

                result = await OTP.findOne({otp:otp}); 
        }

        const otpPayload ={email, otp};

        // create an entry for Otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return response seccessfull
        res.status.json({
            success:true,
            message:"OTP sent successfully",
            otp, 
        })
        
         
    }catch(error){
       console.log(error);
       res.status(500).json({
        success:false,
        message:error.message,
       });
       
    }   
};

// sign up
exports.signUp = async (req, res) => {
  try{
      // data fetch from request ki body
      const {firstName,lastName,email, password, confirmPassword,accountType,contactNumber,otp} = req.body;
      // validate kro
  
      if(!firstName || !lastName || !email || !password || !confirmPassword  || !contactNumber || !otp){
          return res.status(400).json({
              success:false,
              message:"Please fill all the fields",
          });
      }
      //2 password match kr lo
  
      if(password !== confirmPassword){
          return res.status(400).json({
              success:false,
              message:"Password and Confirm Password does not match",
          });
      }
      //check user already exists ya nahi
  
      const existingUser = await User.findOne({email});
      if(existingUser){
          return res.status(401).json({
              success:false,
              message:"User already registered",
          });
      }
      //find most recent otp stored for the user
  
      const resentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
      console.log(resentOtp);
      
      // validate otp
  
      if(resentOtp.length == 0){
          //otp not found
          return res.status(400).json({
              success:false,
              message:"OTP not found",
          });
      }else if(resentOtp.otp !== otp){
          // invilid otp
          return res.status(400).json({
              success:false,
              message:"Invalid OTP",
          });
      }
      // Has password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // entry create in DB
      const profileDetails = await Profile.create({
          gender:null,
          dateOfBirth:null,
          about:null,
          contactNumber:null,
      })
  
  
  
      const user = await User.create({
          firstName,
          lastName,
          email,
          password:hashedPassword,
          accountType,
          contactNumber,
          additionalDetails:profileDetails._id,
          image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`, 
      });
      // return response
      return res.status(200).json({
          success:true,
          message:"User registered successfully",
          user,
      });
  }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        }); 
  }
}

// Login  
exports.login = async (req, res) => {
    try{
        // get data from request body
        const {email, password} = req.body;
        // validation data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required,please try again",
            });
        }
        // user check exists ya nahi
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registered , please sign up first",
            });
        }

        // genreate jwt, after password matching
       if(await bcrypt.compare(password, user.password)){
        const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType, 
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn:"2h",
        }); 
        user.token = token;
        user.password = undefined; 
       
        // create cookie and send response
        const options = {
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        };

        res.cookie("token", token,options).status(200).json({
            success:true,
            token,
            user,
            message:"User logged in successfully",
        })
    }else{
        return res.status(401).json({
            success:false,
            message:" password is inncorrect",
        });
    }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure. Please try again",
        }); 
    }
};

    // change password
exports.changePassword = async (req, res) => {
    // get data from request body
    // get old password and new password, confirm New password
    // vlaidation

    // update pwd in DB
    //send email - password upated 
    // return response
}