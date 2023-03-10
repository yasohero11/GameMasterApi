const path = require("path")
const Games = require("../models/Games")
const Survey = require("../models/survey")
const asyncHandler = require("../middlewares/asyncHandler")
const ErrorResponse = require("../utilities/ErrorResponse")

module.exports = {

    // START get a signle game
    getGame: asyncHandler(async (req, res, next) => {

        const game = await Games.findById(req.params.id)
                        .populate("survey")
                        .populate("tags")

        if (!game)
            return next(new ErrorResponse(`Thier Is No Game With Id ${req.params.id} `, 404))

        res.status(200)
            .json({
                success: true,
                data: game
            })
    }),
    //END



    // STRAT get more than one game 
    getGames: asyncHandler(async (req, res, next) => {


        res.status(200)
            .json(res.advancedResults)
    }),
    //END


    // START create a game
    createGame: asyncHandler(async (req, res, next) => {
        req.body.tags = [...new Set(req.body.tags)]
        const game = await Games.create(req.body)
        
        res.status(201)
            .json({
                success: true,
                data: game
            })

    }),
    // END

    uploadGameImage: asyncHandler(async (req, res, next) => {
        if (!req.files)
            return next(new ErrorResponse(`Please Upload An Image`, 404))

        const file = req.files.file


        if (!file.mimetype.startsWith("image")) {
            return next(new ErrorResponse(`Please Upload An Image`, 400))
        }


        if (file.szie > process.env.MAX_FILE_UPLOAD)
            return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `, 400))

        const game = await Games.findById(req.params.id)


        if (!game)
            return next(new ErrorResponse(`Thier Is No Game With Id ${req.params.id} `, 404))

        file.name = `image_${game._id}${path.parse(file.name).ext}`

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                return next(new ErrorResponse(`Problem with file upload`, 500))
            }

            await Games.findByIdAndUpdate(req.params.id, { image: file.name })
        })

        res.status(201)
            .json({
                success: true,
                fileNAme: file.name
            })

    }),

    // START update a game
    updateGame: asyncHandler(async (req, res, next) => {

        const game = await Games.findById(req.params.id)

        if (!game)
            return next(new ErrorResponse(`No Game With Id ${req.params.id}`, 404))

        const updatedGame = await Games.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200)
            .json({
                success: true,
                data: updatedGame
            })
    }),
    // END



    // START delete a game
    deleteGame: asyncHandler(async (req, res, next) => {



        const deletedGame = await Games.findById(req.params.id)
        if (!deletedGame) {
            return next(new ErrorResponse(`Thier Is No Game With Id ${req.params.id}`), 404)
        }
        deletedGame.remove();
        res.status(200)
            .json({
                success: true,
                _id: deletedGame._id
            })

    }),
    // END 


    // START delete a game
    deleteMany: asyncHandler(async (req, res, next) => {


        const filer = req.query
        const deletedGames = await Games.find(filer)
        await Games.deleteMany(filer)

        //deletedGame.remove();
        res.status(200)
            .json({
                success: true,
                totle: deletedGames.lenth,
                deletedGames
            })

    })
    // END

}