const express = require("express");
const booksPath = require("./routes/books");
const authorsPath = require("./routes/authors");
const authPath = require("./routes/auth");
const usersPath = require("./routes/users");
const { notFound, errorHandler } = require("./middlewares/errors");
require("dotenv").config();
const { connectToDB } = require("./config/db");

connectToDB();

const app = express();
// Apply Middlewares
app.use(express.json());
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/books", booksPath);
app.use("/api/authors", authorsPath);
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);
app.use(notFound)
app.use(errorHandler)
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
