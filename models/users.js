const mangoose = require('mongoose')
const bcrypt = require("bcryptjs")

const crypto = require('crypto');
const jwt =  require("jsonwebtoken")


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
        unique: true,
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
    },
    activate: {
        type:Boolean,
        default:true
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


UserSchema.pre('save',async function(next){

    if (!this.isModified('password')) {
        next();
      }

    const salt = await bcrypt.genSalt(10)
    console.log(this.password)
    this.password =  await bcrypt.hash(this.password, salt)
    console.log(this.password)
    next()
})


// JWT


UserSchema.methods.getJwtToken = function(){
    return jwt.sign(
        {id:this._id}, 
        process.env.JWT_SECRET,
        {
           expiresIn:process.env.JWT_EXPIRE 
        })
}

UserSchema.methods.matchPassword = async function (enteredPassword) {
    
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };


module.exports = mangoose.model("users",UserSchema);