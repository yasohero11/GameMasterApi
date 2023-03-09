const jwt = require("jsonwebtoken")
const asyncHandler = require("./asyncHandler")
const errorHandler = require("./errorHandler")
const ErrorResponse = require("../utilities/ErrorResponse")
const Users =  require("../models/users")


exports.protect = asyncHandler( async (req, res , next)=>{

    let token
    
    if(req.headers.authorization){
        
        if(req.headers.authorization.startsWith("Bearer"))
            token = req.headers.authorization.split(" ")[1]
        else 
            token = req.headers.authorization 
    }    
    else if(req.cookies.token){
        token = req.cookies.token
    }

    if(!token)
        return next(new ErrorResponse("Unauthorized access to this route" , 401))


    // verify token 
    const decodedToken  = jwt.verify(token , process.env.JWT_SECRET)
    req.user = await Users.findOne({_id : decodedToken.id})


    if(!req.user)
        return next(new ErrorResponse("Unauthorized access to this route, No user with that Email" , 401))

    next()
})

exports.authorize =  (...rolse)=>{

    return (req, res, next) =>{

        if(!rolse.includes(req.user.role))
             return next(new ErrorResponse(`User role:${req.user.role} Unauthorized access to this route` , 401))

        next()

    }
}


