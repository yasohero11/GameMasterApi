const mangoose = require('mongoose')



const UserSchema =  new mangoose.Schema({

    name:{
        type:String,
        require:[true, "Please Enter Your Display Name"]
    },

    role:{
        type:String,        
        enum:["user","admin"],
        default: "user",
    },

    email:{
        type:String,
        required: [true , 'please Enter Your Email'],
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Please Add Valid Email"]
    },

    password:{
        type:String,
        required:[true, 'Please Enter Your Password'],
        select:false
    },

    image:{
        type:String,
        required:[true, 'Please Enter Your Photo'],
        default:"user_placeholder.png"
    }
})


module.exports = mangoose.model("users",UserSchema);