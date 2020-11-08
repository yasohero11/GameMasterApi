const mongoose =  require("mongoose")
const slugify = require("slugify")
urlRegex =[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ ,
    "This URL is not valid please try again"]

const GamesSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, "Game's Name Is Required"],
        unique:[true, "Game's Name Should be Uniqe"],
        trim: true,
        maxlength:[50, "Game's Name Should Not Br Longer Than 50 Characters"]
    },

    price:{
        type: Number,
        required:[true, "Game's Price Is Required"]
    },

    
    slug: String,
    createdAt:{
        type:Date,
        default:Date()
    },

    image:{
        type:String,
        required:[true, "Game's Image IS Required"], 
        default:"game_placeholder.png"
    },

    /*
    description:{
        type:String,
        required:[true, "Game's Description IS Required"]
    },


   

    averageRateing:{
            type:Number,
            min:[1, "The Minimum Rating Is 1"],
            max:[5, "The Maximum Rating Is 5"]
    },

    
    facebookPage:{
        type:String,
        match:urlRegex
    },
    twitterPage:{
        type:String,
        match:urlRegex
    },
    instagramPage:{
        type:String,
        match:urlRegex
    },
    twitchPage:{
        type:String,
        match:urlRegex
    },
    youtubePage:{
        type:String,
        match:urlRegex
    },
    website:{
        type:String,
        match:urlRegex
    },       
    publisher:{
        type:[String],
        required :[ true , "Please Enter The Name/Names OF the Publisher/Publishers"],
    },
    developers:{
        type:[String],
        required :[ true , "Please Enter The Name/Names OF the Developer/Developers"],
    },
    downloadLink:{
        type:String,
        match:urlRegex
    },
    */

},
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)

GamesSchema.pre('remove',   async function(next) {
    console.log("deleteing games and it's surveyes")
    await this.model("survey").deleteMany({gameId :this._id})
    next()
  });

GamesSchema.pre("save", function(next){    
    this.slug = slugify(this.name, {lower:true})
    next()
})


GamesSchema.virtual("survey",{
    ref:"survey",
    localField:"_id",
    foreignField:"gameId",
    justOne: false
})


module.exports =  mongoose.model("Games", GamesSchema)