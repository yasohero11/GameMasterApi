const mongoose = require("mongoose")

const connectDb = async () =>{
    const conn = await mongoose.connect(process.env.DATABASE,
        {
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology:true
        })

    console.log(`Mongodb Is connected : ${conn.connection.host}`.cyan.underline.bold)
}

module.exports =  connectDb