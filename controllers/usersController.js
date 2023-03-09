const Users = require("../models/users")

const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utilities/ErrorResponse")


exports.getUsers = asyncHandler(async (req,res,next)=>{
    res.status(200).json(res.advancedResults)
})



exports.getUser = asyncHandler(async (req, res, next)=>{

    const user = await Users.findById(req.params.id)

    if(!user)
        return next( new ErrorResponse(`Thier Is No User With Id ${req.params.id}`), 404)

    res.status(200).json({
        success:true,
        data: user
    })

})


exports.createUser =  asyncHandler(async (req, res, next)=>{

    const {name, email, password, role } = {...req.body}

    const userTest = await Users.findOne({email})

    
    if(userTest)
        return next(new ErrorResponse("This email is already in use!" , 401))


    const user  = await Users.create(req.body) 
    res.status(201)
        .json({
            success:true,
            user
        })
})

exports.updateUser= asyncHandler(async (req, res , next)=>{

    const user = await Users.findById(req.params.id)
    
    if(!user)
        return next(new ErrorResponse(`No User With Id ${req.params.id}` , 404))
        
    const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200)
        .json({
            success: true,
            data: updatedUser
        })

})



exports.deleteUser = asyncHandler(async (req, res, next)=>{
    const user =  await Users.findById(req.params.id)

    if(!user)
        return next(new ErrorResponse(`No User With Id ${req.params.id}` , 404))


    
    if(user.role == "admin")
        return next(new ErrorResponse(`Cant Delete User With Role:Admin` , 401))

    user.remove()
    res.status(200).json(
        {
            success:true,
            
        }
    )
})

exports.disActivateUser = asyncHandler(async (req, res, next)=>{
    const user =  await Users.findById(req.params.id)

    if(!user)
        return next(new ErrorResponse(`No User With Id ${req.params.id}` , 404))
    

    if(user.role == "admin")
        return next(new ErrorResponse(`Cant Delete User With Role:Admin` , 401))

    user.activate = false
    user.save({ validateBeforeSave: false })
    res.status(200).json(
        {
            success:true,
            user
        }
    )
})

