const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.connect({
    email:{
        type:String,
        required:true,
        
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});


//  a function to send Emails
async function sendVerficationEmail(email,otp) {
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNation",otp)
        console.log("Email sent successfully",mailResponse);
        
    }catch(error){
        console.log("error occured while sending mails:",error);
        throw error;
    }
    
}


OTPSchema.pre("save", async function(next){
    await sendVerficationEmail(this.email, this.otp)
    next();
})







module.exports = mongoose.model("OTP", OTPSchema)