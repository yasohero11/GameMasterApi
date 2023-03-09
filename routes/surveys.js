const express = require("express");
const router =  express.Router({mergeParams:true})

const surveys = require("../models/survey")

const {getServeys, getServey, createServey, updateServey, deleteServey, deleteMany}  = require("../controllers/surveysController")
const advancedResults = require("../middlewares/advancedResults")

const {protect, authorize} = require("../middlewares/auth")

router.route("/")
        .get(advancedResults(surveys,"users"),getServeys)
        


router.route("/deletemany").delete(protect, authorize("admin"), deleteMany)




router.route("/:id")
        .get(getServey)
        .post(protect, authorize("user", "admin"), createServey)
        .put(protect, authorize("user", "admin"), updateServey)
        .delete(protect, authorize("user","admin"),deleteServey)


module.exports = router