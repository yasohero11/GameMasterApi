const ErrorResponse = require("../utilities/ErrorResponse")
// custom error hnadler
const errorHandler = (err, req, res, next)=>{

    let error = {...err}
    
    error.message = err.message
    

    if(err.name === "CastError"){
        error = new ErrorResponse(`Element Not Found With Id of ${err.value}`, 404)
    }else if( err.name === "ValidationError"){
        error = new ErrorResponse(Object.values(err.errors).map(val => val.message), 400)
    }


    if(err.code === 11000){
        error = new ErrorResponse(`Duplicate field value enterd`, 400)
    }



    console.log(error.message.red.bold)

    res.status(error.statusCode || 500)
       .json({
           success:false,
           msg: error.message || "Server Error"
       })
}


module.exports = errorHandler