require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database."));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

const lecturerRouter = require("./routes/lecturer");
app.use("/lecturer", lecturerRouter);

const studentRouter = require("./routes/student");
app.use("/student", studentRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
