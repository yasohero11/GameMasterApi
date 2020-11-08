const mangoose = require('mongoose')



const SurveySchema =  new mangoose.Schema({

    gameId:{
        type: mangoose.Schema.ObjectId,
        ref: 'Games', 
        required: true
    },

    userName:{
        type:String,
        required:[true, "User Name Field Is Requiered"]
    },

    userImage:{
        type:String,
        required:[true, "User Image Field Is Requiered"]
    },

    comment:{
        type:String,
        required:[true, "User Comment Field Is Requiered"]
    },

    rate:{
        type:Number,
        required:[true, "User Rate Field Is Requiered"],
    },

    date:{
        type:Date,
        default:Date()
    }



})

module.exports = mangoose.model("survey",SurveySchema);