const Users = require("../models/users")
const crypto = require("crypto")
const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utilities/ErrorResponse")
const sendEmail = require("../utilities/sendEmail")
const path = require("path")



// function to create a token and send a cookie to the clinit
const sendJwtTokenResponse = (user, statusCode, res) => {
    const token = user.getJwtToken()

    user  = {...user["_doc"]}
    delete user.password
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true

    }


    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }


    res
        .status(200)
        .cookie('token',
            token,
            options)
        .json({
            success: true,
            token,
            user: user
        })


}

// end 

exports.uploadUserImage = asyncHandler(async (req, res, next) => {
    if (!req.files)
        return next(new ErrorResponse(`Please Upload An Image`, 404))

    const file = req.files.file


    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please Upload An Image`, 400))
    }


    if (file.szie > process.env.MAX_FILE_UPLOAD)
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `, 400))


        /*
    if (!game)
        return next(new ErrorResponse(`Thier Is No Game With Id ${req.params.id} `, 404))
    */

    file.name = `image_${Math.random(10)}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }

       
    })

    res.status(201)
        .json({
            success: true,
            imageName: file.name
        })

})

exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = { ...req.body }

    const userTest = await Users.findOne({ email })


    if (userTest)
        return next(new ErrorResponse("This email is already in use!", 401))


    user = await Users.create(req.body)
   
    sendJwtTokenResponse(user, 201, res)
})


exports.loginUser = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password)
        return next(new ErrorResponse(`please fill the fields`), 401)

    const user = await Users.findOne({ email }).select("password")
    console.log(user)
    if (!user)
        return next(new ErrorResponse(`Email or Password is wrong`), 401)

    if(user.activate != true && user.activate != undefined)
        return next(new ErrorResponse(`This email is been deleted`), 401)

    const passwordMatched = await user.matchPassword(password)

    if (!passwordMatched)
        return next(new ErrorResponse(`Email or Password is wrong 2`), 401)


    sendJwtTokenResponse(await Users.findOne({ email }), 200, res)


})

exports.logout = asyncHandler(async (req, res, next)=>{
    res.cookie("token", "none",{
        expires:new Date(Date.now()+ 1 *1000),
        httpOnly:true
    })
    res.status(200).json({
        success:true
    })
})


exports.getMe = asyncHandler(async (req, res, next)=>{
    res.status(200).json({user: req.user})
})

exports.updateUser = asyncHandler(async (req, res, next)=>{
    if(req.body.email){
        const userExistes = await Users.findOne({
            email: req.body.email,
            _id :{$ne : req.user._id}
        })
        
        if(userExistes)
            return next(new ErrorResponse("This email is already in use!", 401))

    }
    const fieldsToUpdate = 
     {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
      };
      
      
      const user = await Users.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
      });
    
      res.status(200).json({
        success: true,
        data: user,
      });

})


exports.updatePassword = asyncHandler(async (req, res, next )=>{

    const {currentPassword, newPassword} = req.body
    if(!currentPassword || !newPassword )
        return next(new ErrorResponse("Please enter the current and new password", 401))        

    const user = await Users.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }
  
    user.password = req.body.newPassword;
    await user.save();

    try {
        
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message:`Hey ${user.name} your password rest Successfuly`
        });

        sendJwtTokenResponse(user, 200, res);
    } catch (err) {
        console.log(err);

        return next(new ErrorResponse('Email could not be sent', 500));
    }
  
 

})



exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) 
        return next(new ErrorResponse('There is no user with that email', 404));
    

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `<div> <p> You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n <a href="${resetUrl}">${resetUrl}</a> </p> </div>`;

    try {
        
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }

})

exports.resetPassword =  asyncHandler(async (req, res, next)=>{

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetPasswordToken)
        .digest('hex')


    let user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()}
    })
    console.log(user)
    if(!user)
        return next(new ErrorResponse('Inavlid token', 400));
    
   

    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    try {
        
        await sendEmail({
            email: user.email,
            subject: 'Password reset token Completed',
            message:`Hey ${user.name} your password reset is completed succesfuly <3`
        });

        sendJwtTokenResponse(user , 200, res)
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }


   

})



