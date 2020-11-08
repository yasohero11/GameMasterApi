
const asyncHandler =  require("../middlewares/asyncHandler")
const Serveys = require("../models/survey")
const Games = require("../models/Games")
const ErrorResponse = require("../utilities/ErrorResponse")


module.exports = {

    // START get a signle Servey
   getServey : asyncHandler( async (req, res, next)=>{
            
            const Servey = await Serveys.findById(req.params.id)
            res.status(200)
                .json({
                    success: true,
                    data: Servey
                })
    }),
    //END



    // STRAT get more than one Servey 
    getServeys : asyncHandler( async (req, res, next) =>{
        
        /*
            let servies
            let query
            let selectedFields
            let sortBy
            // the current page
            const page = parseInt(req.query.page,10) || 1;
            // the limit number of the Servey
            const limit =  parseInt(req.query.limit, 10) || 2;
            const startIndex = (page - 1) * limit

            const totalDocs = Serveys.countDocuments()
            // the main query from the request
            const reqQuery = {... req.query}
            // removable fileds
            const removedFields = ['select', 'sort','page','limit']
            removedFields.forEach(param => delete reqQuery[param])
            // string version of the query
            let queryStr =  JSON.stringify(reqQuery)

            queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, str => `$${str}`)
            
            query =   Serveys.find(JSON.parse(queryStr))
            
            if(req.query.select){   
                selectedFields = req.query.select.split(",").join(" ")                       
                query = query.select(selectedFields);
            }

            if(req.query.sort){
                sortBy =  req.query.sort.split(",").join(" ")              
                query = query.sort(`${sortBy}`);
            }else            
                query = query.sort(`-createdAt`);

            // paggination
            query =  query.skip(startIndex).limit(limit)
            
            Serveys = await query
            */
           let serveys;
            
           if(req.params.gameId){
            serveys  = await Serveys.find({gameId:req.params.gameId})
           }else
            serveys  = await Serveys.find()
            res.status(200)
                .json({
                    success: true,    
                    count: serveys.length,
                    data: serveys
                })
    }),
    //END


    // START create a Servey
    createServey : asyncHandler( async (req, res, next) =>{
            req.body.gameId = req.params.gameId
            
            const game = Games.findById({_id:req.params.gameId})

            if(!game){
                return next(
                    new ErrorResponse(new ErrorResponse(`Thier Is No Game With Id ${req.params.id} `, 404))
                )
            }

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
        
            const deletedServey  = await Serveys.findByIdAndDelete(req.params.id)
            res.status(200)
               .json({
                   success:true,
                   _id:deletedServey._id
               })

    })
    // END 

}