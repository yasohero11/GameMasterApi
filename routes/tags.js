const express =  require("express")

const router = express.Router()


const {getTags, createTag, updateTag, deleteTag} = require("../controllers/tagsController")

router.route("/")
    .get(getTags)
    .post(createTag)

router.route("/:id")
    .put(updateTag)
    .delete(deleteTag)


module.exports = router