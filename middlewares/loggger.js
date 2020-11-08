// createing middleware
module.exports = (req, res, next)=>{
    req.user =  "curren user"
    console.log(req.user)
    next();
}

