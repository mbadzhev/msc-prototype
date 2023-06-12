const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database."));

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
