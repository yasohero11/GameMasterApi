const Users = require("../models/users")

const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utilities/ErrorResponse")


module.exports = {

    getUser: asyncHandler(async (req, res, next)=>{

        const user = await Users.findById(req.params.id)

        if(!user)
            return next( new ErrorResponse(`Thier Is No User With Id ${req.params.id}`), 404)

        res.status(200).json({
            success:true,
            data: user
        })

    }),


    createUser:  asyncHandler(async (req, res, next)=>{
        
        const user  = await Users.create(req.body)
        res.status(201).json({
            success:true,
            data: user
        })
    }),

    loginUser: asyncHandler(async (req, res, next)=>{

        const {email, password} = req.body

        if(!email || !password)
            return next( new ErrorResponse(`please fill the fields`), 400)

            const user  =  await Users.findOne({email, password})
            
            if(!user)
                return next( new ErrorResponse(`Email or Password is wrong`), 400)
                

            

            res.status(201).json({
                success:true,
                data: user
            })

    })



}