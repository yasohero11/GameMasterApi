const express = require("express");
const router = express.Router()

const { register, loginUser, forgotPassword, resetPassword, updateUser, getMe, updatePassword, logout } = require("../controllers/auth")

const {protect} =  require("../middlewares/auth")


router.post("/register", register)

router.post("/login", loginUser)

router.get("/forgetpassword", forgotPassword)
router.get("/logout",protect ,logout)
router.get("/me", protect ,getMe)
router.put("/updateuser", protect, updateUser)
router.put("/updatepassword", protect, updatePassword)
router.put("/resetpassword/:resetPasswordToken", resetPassword)






module.exports = router