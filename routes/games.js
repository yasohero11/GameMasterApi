const express = require("express");
const surveyRouter = require("./surveys")
const router =  express.Router()


router.use("/:gameId/surveys" , surveyRouter)

const {getGames, getGame, createGame, updateGame, deleteGame, uploadGameImage}  = require("../controllers/gamesController")



router.route("/")
        .get(getGames)
        .post(createGame)


router.route("/:id/upload")
        .put(uploadGameImage)  

router.route("/:id")
        .get(getGame)       
        .put(updateGame)
        .delete(deleteGame)


module.exports = router