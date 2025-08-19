const { Book } = require("./models/Book");
const { books } = require("./data");
const { connectToDB } = require("./config/db");
require("dotenv").config();

// Connection To DB
connectToDB();


const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Removed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
}