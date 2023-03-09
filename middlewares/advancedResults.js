
module.exports = (Model, Populate) => async (req, res, next) => {



    let query
    let selectedFields
    let sortBy


    // the main query from the request
    const reqQuery = { ...req.query }
    
    // removable fileds
    const removedFields = ['select', 'sort', 'page', 'limit']
    removedFields.forEach(param => delete reqQuery[param])
    // string version of the query
    let queryStr = JSON.stringify(reqQuery)



    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, str => `$${str}`)

    // the current page
    const page = parseInt(req.query.page, 10) || 1;
    // the limit number of the games
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Model.countDocuments(JSON.parse(queryStr));
    // Pagination result
    const pagination = {};
    let URL = `${ req.protocol}://${req.get('host')}/${req.originalUrl}`

    if(URL.search(`page=${page}`) == -1)
        URL = `${URL}&page=${page}`


    if (endIndex < total) {
        pagination.next = {
            page: URL.replace(`page=${page}`,`page=${page+1}`),
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: URL.search(`page=${page}`) > 0? URL.replace(`page=${page}`,`page=${page-1}`): `${URL}&page=${page-1}`,
            limit
        };
    }

 
    

    query = Model.find(JSON.parse(queryStr))

  

    if (req.query.select) {
        selectedFields = req.query.select.split(",").join(" ")
        query = query.select(selectedFields);
    }

    if (req.query.sort) {
        sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(`${sortBy}`);
    } else
        query = query.sort(`-createdAt`);

    // paggination
    query = query.skip(startIndex).limit(limit)

    if (Populate) {
        query = query.populate(Populate);
    }

    results = await query
    
    res.advancedResults = {
        success: true,
        total,
        count: results.length,
        pagination,
        data: results
    };

      next()

    }
