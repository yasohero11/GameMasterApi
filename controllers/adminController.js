const Users = require("../models/users")
const Games = require("../models/Games")
const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utilities/ErrorResponse")


exports.getAllUsers=  asyncHandler(async (req,res,next)=>{
    res.status(200).json(res.advancedResults)
})