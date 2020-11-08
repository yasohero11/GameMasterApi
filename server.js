const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const connectDb = require("./config/db")
const colors = require('colors')
const fileuploader = require("express-fileupload")
const errorHandler = require("./middlewares/errorHandler")

// route files 
const games = require("./routes/games")
const serveys = require("./routes/surveys")
const auth = require("./routes/auth")


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

// file uploader
app.use(fileuploader())

app.use(express.static(path.join(__dirname, "public")))
//app.use(logger)
app.use("/api/v1/games/" ,  games)
app.use("/api/v1/surveys/" ,  serveys)
app.use("/api/v1/auth/" ,  auth)



app.use(errorHandler)

// listeing on a PORT
const server = app.listen(PORT , console.log(`srerver is running on PORT : ${PORT}`.yellow.bold))



// unhndeled rejecttions or errors

process.on("unhandledRejection", (err, promise)=>{
    console.log(`Error from unhandeldRejection and the message is : ${err.message}`.bgBlack.red.bold)
    server.close(()=>{
        process.exit(1)
    })

})