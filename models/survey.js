const mangoose = require('mongoose')



const SurveySchema =  new mangoose.Schema({

    game:{
        type: mangoose.Schema.ObjectId,
        ref: 'Games', 
        required: true
    },

    user:{
        type: mangoose.Schema.ObjectId,
        ref: 'users', 
        required: true
    },
   

    comment:{
        type:String,
        required:[true, "User Comment Field Is Requiered"]
    },

    rating: {
        type: Number,
        default:1,
        min: [1, "The Minimum Rating Is 1"],
        max: [5, "The Maximum Rating Is 5"]
    },

    date:{
        type:Date,
        default:Date()
    }



})

SurveySchema.statics.getAverageRating = async function(gameId) {
   
    const obj = await this.aggregate([
      {
        $match: { game: gameId }
      },
      {
        $group: {
          _id: '$game',
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
  
   try {

    console.log(obj)
      if (obj[0]) {

        const myres= await this.model("Games").findByIdAndUpdate(gameId, {
          averageRating: obj[0].averageRating.toFixed(1),
        });
        console.log(myres)
      } 
    }  catch (err) {
      console.error(err);
    }
  };


  // Call getAverageCost after save
SurveySchema.post('save', async function() {
    await this.constructor.getAverageRating(this.game);
  });

module.exports = mangoose.model("survey",SurveySchema);