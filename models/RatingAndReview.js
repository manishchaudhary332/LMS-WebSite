const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.connect({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("RatingAndReview", ratingAndReviewsSchema)