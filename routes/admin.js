const express =  require("express")

const router = express.Router()

const Users = require("../models/users")

const {getAllUsers} = require("../controllers/adminController")
const advancedResults = require("../middlewares/advancedResults")



router.route("/users")
    .get(advancedResults(Users),getAllUsers)


module.exports = router




