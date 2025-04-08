const mongoose = require("mongoose");

const postSchema = new mongoose.connect({
  gender:{
    type:String,
  },
  dateOfBirth:{
    type:String,
  },
  about:{
    type:String,
    trim:true,
  },
  contactNumber:{
    type:Number,
    trim:true,
  }
})

module.exports = mongoose.model("Profile", postSchema)