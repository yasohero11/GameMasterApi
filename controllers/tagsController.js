const Tags = require("../models/Tags")
const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utilities/ErrorResponse")



exports.getTags =  asyncHandler( async (req, res , next)=>{
    const tags = await Tags.find()

    

    res.status(200).json({
        success: true,
        total: tags.length,
        data: tags

    })
})


exports.createTag =  asyncHandler( async (req, res, next)=>{
    console.log(req.body)
    const tag = await Tags.create(req.body)

    if(!tag)
        return next(new ErrorResponse("Tag cant be created"))

    res.status(200).json({
        success: true,
        tag
    })
})

exports.updateTag = asyncHandler(async (req, res, next)=>{
    const tag = await Tags.findById(req.params.id)
    
    if(!tag)
        return next(new ErrorResponse(`There are no tag with id ${req.params.id}`))
    
    const updatedTag = await Tags.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.status(200).json({
        success:true,
        tag : updatedTag
    })
})

exports.deleteTag = asyncHandler(async (req, res ,next)=>{
    
    const deletedTag = await Tags.findById(req.params.id)  

    if(!deletedTag)
        return next(new ErrorResponse(`There are no tag with id ${req.params.id}`))

    await deletedTag.remove()

    res.status(200).json({
        success:true,
        deletedTag
    })
})