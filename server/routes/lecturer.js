const express = require("express");
const router = express.Router();
const Class = require("../models/class");
const Token = require("../models/token");
const Student = require("../models/student");
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
  const newStudent = new Student({
    number: 18600219,
    name: "StudentName1",
  });
  const tempClass = new Class({
    module: req.body.module,
  });
  tempClass.studentsAbsent.push(newStudent);
  try {
    const newClass = await tempClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//add token
router.patch("/:id", getClass, async (req, res) => {
  let currentDate = new Date();
  let milSecs = currentDate.getTime();
  let addMilSecs = 60 * 60 * 1000;
  let newDate = new Date(milSecs + addMilSecs);
  const newToken = new Token({
    code: randomNumInRange(1000, 9999),
    dateTime: newDate,
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
  const studentNumber = req.params.studentId;
  const objectIndex1 = res.searchClass.studentsAbsent.findIndex(
    (item) => item && item.number.toString() === studentNumber
  );
  const objectIndex2 = res.searchClass.studentsPresent.findIndex(
    (item) => item && item.number.toString() === studentNumber
  );

  if (objectIndex1 !== -1) {
    const [removedObject] = res.searchClass.studentsAbsent.splice(
      objectIndex1,
      1
    );
    res.searchClass.studentsPresent.push(removedObject);
  } else if (objectIndex2 !== -1) {
    const [removedObject] = res.searchClass.studentsPresent.splice(
      objectIndex2,
      1
    );
    res.searchClass.studentsAbsent.push(removedObject);
  } else {
    return res.status(400).json({ message: "Object not found in any array." });
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
