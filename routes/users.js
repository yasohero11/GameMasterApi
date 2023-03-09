const express = require("express")
const router = express.Router()
const Users = require("../models/users")

const advancedResults =  require("../middlewares/advancedResults")
const {getUsers , getUser, createUser, updateUser, disActivateUser, deleteUser} =  require("../controllers/usersController")
const {protect , authorize} = require("../middlewares/auth")


router.use(protect);
router.use(authorize('admin'));

router.route("/")
    .get(advancedResults(Users) , getUsers)
    .post(createUser)

router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .post(disActivateUser)
    .delete(deleteUser)

module.exports = router





