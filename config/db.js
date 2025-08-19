const mongoose = require("mongoose");

async function connectToDB() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected To DB"))
    .catch((error) => console.log("Connection Failed: ", error));
}

module.exports = { connectToDB };