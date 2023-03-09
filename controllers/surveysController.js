
const asyncHandler =  require("../middlewares/asyncHandler")
const Serveys = require("../models/survey")
const Games = require("../models/Games")
const ErrorResponse = require("../utilities/ErrorResponse")
const survey = require("../models/survey")


module.exports = {

    // START get a signle Servey
   getServey : asyncHandler( async (req, res, next)=>{
            
            const Servey = await Serveys.findById(req.params.id).populate({
                path:"game",
                select:"name, price"
            }).populate({
                path:"user",
                select:"name, email"
            })
            res.status(200)
                .json({
                    success: true,
                    data: Servey
                })
    }),
    //END



    // STRAT get more than one Servey 
    getServeys : asyncHandler( async (req, res, next) =>{
        
     
           let serveys;
            
           if(req.params.gameId){
                serveys  = await Serveys.find({gameId:req.params.gameId})
                res.status(200)
                .json({
                    success: true,    
                    count: serveys.length,
                    data: serveys
                })
           }else{
            serveys  = await Serveys.find()
            res.status(200).json(res.advancedResults)

           }
           
    }),
    //END


    // START create a Servey
    createServey : asyncHandler( async (req, res, next) =>{

          
            
            const game = Games.findById({_id:req.params.id})

            if(!game){
                return next(
                  new ErrorResponse(`Thier Is No Game With Id ${req.params.id} `, 404)
                )
            }
            req.body.game= req.params.id
            req.body.user = req.user._id
            const servey = await Serveys.create(req.body)
            res.status(201)
                .json({
                    success: true,
                    data: servey    
                })
                
    }),
    // END

    // START update a Servey
    updateServey : asyncHandler( async (req, res, next) =>{

            const servey = await Serveys.findById(req.params.id)
                  
            if(!servey)
                return next(new ErrorResponse(`No servey with id ${req.params.id}`, 404))
                
            if(req.user._id != servey.user.toString() && req.user.role != "admin" )
                return next(new ErrorResponse(`Unauthorize access to servey ${req.params.id} from user ${req.user._id} `, 404))


            const updatedServey = await Serveys.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            res.status(200)
                .json({
                    success: true,
                    data: updatedServey
                })
    }),
    // END



    // START delete a Servey
    deleteServey: asyncHandler( async (req, res, next) =>{
        
            

            let servey = await Serveys.findById(req.params.id)
            
            if(!servey)
                return next(new ErrorResponse(`No servey with id ${req.params.id}`, 404))
            
            if(req.user._id != servey.user.toString() && req.user.role != "admin" )
                return next(new ErrorResponse(`Unauthorize access to servey ${req.params.id} from user ${req.user._id} `, 404))

            
            servey =  await servey.remove()   

            res.status(200)
               .json({
                   success:true,
                   id:servey._id
               })

    }),
    // END 

       // START delete a game
       deleteMany: asyncHandler(async (req, res, next) => {


        const filer = req.query
        const deletedServeys = await Serveys.find(filer)
        await Serveys.deleteMany(filer)

        //deletedGame.remove();
        res.status(200)
            .json({
                success: true,
                totle: deletedServeys.length,
                deletedServeys
            })

    })
    // END

}