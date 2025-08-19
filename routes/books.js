const express = require("express");
const router = express.Router();
const asyncHanlder = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { validateCreateBook, validateUpdateBook, Book } = require("../models/Book");

/** 
  *  @desc    Get All Books
  *  @route   /api/books
  *  @method  GET
  *  @access  public
*/

router.get("/", asyncHanlder(async (req, res) => {
  console.log(req.query);
  // Comparison Query Operators
  // Book.find({price: {$lt: 10}})
  // $eq   (equal)
  // $ne   (not equal)
  // $lt   (Less Than)
  // $lte  (Less Than and Equal)
  // $gt   (greater than)
  // $gte   (greater than and Equal)
  const books = await Book.find().populate("author", ["id", "firstName", "lastName"]);
  res.status(200).json(books);
}));

/** 
  *  @desc    Get Book By ID
  *  @route   /api/books/:id
  *  @method  GET
  *  @access  public
*/
router.get("/:id", asyncHanlder(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author", ["id", "firstName", "lastName"]);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book Not Found" });
  }
}));

/** 
  *  @desc    Create New Book
  *  @route   /api/books
  *  @method  POST
  *  @access  private (Only Admin)
*/

router.post("/", verifyTokenAndAdmin, asyncHanlder(async (req, res) => {
  let body = req.body;
  const { error } = validateCreateBook(body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
  if (!body.title) {
    return res.status(400).json({ message: "Title is required" });
  } else if (body.title.length < 3) {
    return res.status(400).json({ message: "Title Must Be Greater Than 3 Characters" });
  }
  if (!body.description) {
    return res.status(400).json({ message: "Description is required" });
  } else if (body.description.length < 3) {
    return res.status(400).json({ message: "Description Must Be Greater Than 3 Characters" });
  }
  const book = new Book({
    title: body.title,
    author: body.author,
    description: body.description,
    price: body.price,
    cover: body.cover,
  })
  const result = await book.save();
  res.status(201).json(result);
}));

/** 
  *  @desc    Update a Book
  *  @route   /api/books/:id
  *  @method  PUT
  *  @access  private
*/
router.put("/:id", verifyTokenAndAdmin, asyncHanlder(async (req, res) => {
  let body = req.body;
  const { error } = validateUpdateBook(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
    $set: {
      title: body.title,
      author: body.author,
      description: body.description,
      price: body.price,
      cover: body.cover,
    }
  }, { new: true });
  res.status(200).json(updatedBook);
}));

/** 
  *  @desc    Delete a Book
  *  @route   /api/books/:id
  *  @method  DELETE
  *  @access  private
*/
router.delete("/:id", verifyTokenAndAdmin, asyncHanlder( async (req, res) => {
  const book = Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book Has Been Deleted" });
  } else {
    res.status(404).json({ message: "Book Not Found" });
  }
}
));


module.exports = router;