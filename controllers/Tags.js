const Tag = require('../models/Tag');


// create tag ka handler function

exports.createTag = async (req, res) => {
    try {
        // fetch data
        const { name,description  } = req.body;
        // validate data
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'all fields are required', 
            });
        } 
        // create entry in db
        const tagDetails = await Tag.create({
            name: name,
            description: description,
            
        });
        console.log(tagDetails);
        // return response
        return res.status(200 ).json({
            success: true,
            message: 'Tag created successfully',
         });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
} 


// get all tags ka handler function

exports.showAllTags = async (req, res) => {
    try {
        // get all tags from db
        const allTags = await Tag.find({},{name:true,description:true});
        // return response
         res.status(200).json({
            success: true,
            message: 'ALL tags return successfully',
            allTags,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}