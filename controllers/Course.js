const Course = require('../models/Course')
const Tag = require("../models/tags")
const User =  require("../models/User")
const {uploadImageToCloudinary} = require('../utils/imageUploader');

    // create course handler function

    exports.createCourse = async (req,res)=>{
        try{
            // fetch data
            const {courseName, courseDescription, whatYouWillLearn, price , tag} = req.body;
            // get thumbnail

            const thumbnail = req.files.thumbnailImage;

            // validation
            if(!courseName || !courseDescription || !price || !tag || !thumbnail){
                 return res.status(400).json({
                    success:false,
                    message:"ALl Fields are required",

                 })
            }

            // check for instructor 
            const userId = req.user.id;
            const instructorDetails = await User.findById(userId)
            console.log("Instructor Details", instructorDetails )
            // TODO: verify that userID and instructorDetails._id are same or diffenrent ? 

            if(!instructorDetails){
                return res.status(404).json({ 
                    success:false,
                    message:"Instructor Details not found",
                })
            }
            // check givien tag valid or not
            const tagDetails = await Tag.findById(tag)
            if(!tagDetails){
                return res.status(404).json({
                    success:false, 
                    message:"Tag Details not found"
                });
            }

            // upload Image top cloudinary
        const thumbnailImage  = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,

        })

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {id:instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        // update the tag ka schema
        // TODO: HW

        // return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        })

        }catch(error){
            console.error(error)

            return res.status(500).json({
                success:false,
                message:"Failed to create Course",
                error:error.message,
            })
        }
    };


    // get All courses handler function
    exports.showAllCourses = async (req,res)=>{
        try{
            // TODO: change the below statement incrementally 
            const allCourses = await Course.find({})
                   return res.status(200).json({
                    success:true,
                    message:"Data for All courses fetched successfully",
                    data:allCourses,
                   })                              

        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Can Not  Fetch course data",
                error:error.message
            })
            
        }
    }