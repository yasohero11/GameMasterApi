const express = require("express");
const router =  express.Router({mergeParams:true})

const {getServeys, getServey, createServey, updateServey, deleteServey}  = require("../controllers/surveysController")


router.route("/")
        .get(getServeys)
        .post(createServey)



router.route("/:id")
        .get(getServey)
        .put(updateServey)
        .delete(deleteServey)


module.exports = router