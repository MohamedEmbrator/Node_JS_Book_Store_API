const express = require("express");
const router = express.Router();
const asyncHanlder = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author");
/** 
  *  @desc    Get All Authors
  *  @route   /api/authors
  *  @method  GET
  *  @access  public
*/

router.get("/", asyncHanlder(
  async (req, res) => {
    const  pageNumber  = req.query.pageNumber;
    // const authorsList = await Author.find().sort({firstName: 1}).select("firstName lastName -_id");
    const authorsList = await Author.find().skip((pageNumber - 1) * 2).limit(2);
    res.status(200).json(authorsList);
}
));

/** 
  *  @desc    Get Author By ID
  *  @route   /api/authors/:id
  *  @method  GET
  *  @access  public
*/
router.get("/:id", asyncHanlder(
  async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Author Not Found" });
    }
}
));

/** 
  *  @desc    Create New Author
  *  @route   /api/authors
  *  @method  POST
  *  @access  private (Only Admin)
*/

router.post("/", verifyTokenAndAdmin,asyncHanlder(
  async (req, res) => {
  let body = req.body;
  const { error } = validateCreateAuthor(body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
    const author = new Author({
    firstName: body.firstName,
    lastName: body.lastName,
    nationality: body.nationality,
    image: body.image,
  });
  const result = await author.save();
  res.status(201).json(result);  // 201 => Created Successfully
}
));

/** 
  *  @desc    Update an Author
  *  @route   /api/authors/:id
  *  @method  PUT
  *  @access  private (Only Admin)
*/
router.put("/:id", verifyTokenAndAdmin, asyncHanlder(
  async (req, res) => {
  let body = req.body;
  const { error } = validateUpdateAuthor(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
    const author = await Author.findByIdAndUpdate(req.params.id, {
      $set: {
        firstName: body.firstName,
        lastName: body.lastName,
        nationality: body.nationality,
        image: body.image
      }
    }, { new: true });
    res.status(200).json(author);
}
));

/** 
  *  @desc    Delete an Author
  *  @route   /api/authors/:id
  *  @method  DELETE
  *  @access  private (Only Admin)
*/
router.delete("/:id", verifyTokenAndAdmin, asyncHanlder(
  async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Author Has Been Deleted" });
    } else {
      res.status(404).json({ message: "Author Not Found" });
    }
}
));

module.exports = router;