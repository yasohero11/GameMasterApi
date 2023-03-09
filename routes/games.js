const express = require("express");
const surveyRouter = require("./surveys")

const Games = require("../models/Games")
const advancedResults =  require("../middlewares/advancedResults")
const {protect ,  authorize} = require("../middlewares/auth")
const router =  express.Router()


router.use("/:gameId/surveys" , surveyRouter)

const {getGames, getGame, createGame, updateGame, deleteGame, uploadGameImage, deleteMany}  = require("../controllers/gamesController")



router.route("/")
        .get(advancedResults(Games, "survey"),getGames)
        .post(protect, authorize("admin") , createGame)
        


router.route("/:id/upload")
        .put(protect ,authorize("admin"), uploadGameImage)  


router.route("/deletemany").delete(protect, authorize("admin"), deleteMany)

router.route("/:id")
        .get(getGame)       
        .put(protect, authorize("admin"), updateGame)
        .delete(protect, authorize("admin"), deleteGame)




module.exports = router