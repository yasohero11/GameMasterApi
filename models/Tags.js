const mongoose = require("mongoose")


const TagsSchema = new mongoose.Schema({

    name:{
        type:String,
        unique:[true,"Please enter new name"],
        required:[true, "Please Enter Tag Name"]                
    },

})

TagsSchema.pre('remove', async function (next) {        
    await this.model("Games").updateMany({tags:this._id} , { $pull: { tags: this._id } })
    next()
})

module.exports = mongoose.model("Tags", TagsSchema)