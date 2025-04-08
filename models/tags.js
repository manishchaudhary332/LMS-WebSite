const mongoose = require("mongoose");

const tagsSchema = new mongoose.connect({
    Name:{
        type:String,
        required:true,
        
    },
    description:{
        type:Number,
        
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }
})

module.exports = mongoose.model("Tag", tagsSchema)