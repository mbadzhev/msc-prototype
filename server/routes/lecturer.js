const express = require("express");
const router = express.Router();
const Class = require("../models/class");
const Token = require("../models/token");
const { error } = require("console");

//get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get one class
router.get("/:id", async (req, res) => {
  try {
    const oneClass = await Class.findById(req.params.id);
    res.json(oneClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//create class
router.post("/", async (req, res) => {
  const tempClass = new Class({
    module: req.body.module,
    studentsAbsent: req.body.studentsAbsent,
  });
  try {
    const newClass = await tempClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//add token
router.patch("/:id", getClass, async (req, res) => {
  const newToken = new Token({
    code: randomNumInRange(1000, 9999),
    dateTime: Date.now(),
  });
  try {
    res.searchClass.tokens.push(newToken);
    const updateClass = await res.searchClass.save();
    res.json(res.searchClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//swap student attendance
router.patch("/:id/:studentId", getClass, async (req, res) => {
  const index1 = res.searchClass.studentsPresent.findIndex(
    (element) => (element = req.params.studentId)
  );
  if (index1 == -1) {
    const index2 = res.searchClass.studentsAbsent.findIndex(
      (element) => (element = req.params.studentId)
    );
    res.searchClass.studentsAbsent.splice(index2, 1);
    res.searchClass.studentsPresent.push(req.params.studentId);
  } else {
    res.searchClass.studentsPresent.splice(index1, 1);
    res.searchClass.studentsAbsent.push(req.params.studentId);
  }
  try {
    const docUpdate = await res.searchClass.save();
    res.json(docUpdate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get class from id parameter
async function getClass(req, res, next) {
  let searchClass;
  try {
    searchClass = await Class.findById(req.params.id);
    if (searchClass == null) {
      return res.status(404).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.searchClass = searchClass;
  next();
}

function randomNumInRange(from, to) {
  var r = Math.random();
  return Math.floor(r * (to - from) + from);
}

module.exports = router;
