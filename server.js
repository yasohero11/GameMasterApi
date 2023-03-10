const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require('morgan');
const connectDb = require("./config/db")
const colors = require('colors')
const cookieParser =  require("cookie-parser")
const fileuploader = require("express-fileupload")
const mongoSanitize =  require("express-mongo-sanitize")
const helmet =  require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")

const errorHandler = require("./middlewares/errorHandler")

// route files 
const games = require("./routes/games")
const serveys = require("./routes/surveys")
const auth = require("./routes/auth")
const users = require("./routes/users")
const tags =  require("./routes/tags")



// middleware files
//const logger = require("./middlewares/loggger")

// load env vars 
dotenv.config({path:'./config/config.env'})
const PORT = process.env.PORT || 5000;
const app = express();


// connecting to the database
connectDb()






// using middlewares
app.use(express.json())


app.use(cookieParser())
// file uploader
app.use(fileuploader())

// sanitize data
app.use(mongoSanitize())


// set security headers
app.use(helmet())


// prevent xss attacks
app.use(xss())


// rate limiter

const limiter = rateLimit({
    windowMs:10*60*1000,
    max:100
})

app.use(limiter)

// prevent http param pollution
app.use(hpp())


// enable CORS

app.use(cors())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//app.use(logger)
app.use("/api/v1/games/" ,  games)
app.use("/api/v1/surveys/" ,  serveys)
app.use("/api/v1/auth/" ,  auth)
app.use("/api/v1/users/" , users)
app.use("/api/v1/tags/", tags)




app.use(errorHandler)

// listeing on a PORT
const server = app.listen(PORT , console.log(`srerver is running on PORT : ${PORT}`.yellow.bold))



// unhndeled rejecttions or errors

process.on("unhandledRejection", (err, promise)=>{
    console.log(`Error from unhandeldRejection and the message is : ${err.message}`.bgBlack.red.bold)
    console.log(err)
    console.log(err.stack)
    server.close(()=>{
        process.exit(1)
    })

})