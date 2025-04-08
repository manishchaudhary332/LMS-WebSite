const jwt = require('jsonwebtoken');
require('dotenv').config();
const user = require('../models/User'); 

// auth
exports = async (req, res, next) => {
    try{

        //  extract token 
        const token = req.cookies.token || 
                         req.body.token || 
                         req.header("Autrhorization").replace("Bearer ", "");

        // if token missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }

        // verify token
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
            next();
        }catch(error){
            // verification failed
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"something went wrong, while validating token",
        })
    }
}

// is Student

exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a procted route for students Only",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,please ty again",
        })
    }
}

// is Instructor

exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is a procted route for Instructors Only",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,please ty again",
        })
    }
}

// is Admin

exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a procted route for Admin Only",
            })
        }
        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,please ty again",
        })
    }
}