const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllAuthors, getAuthorById, createNewAuthor, updateAuthorData, deleteAuthor } = require("../controllers/authorController");

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createNewAuthor);

router.route("/:id").get(getAuthorById).put(verifyTokenAndAdmin, updateAuthorData).delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;