const express = require("express");
const router = express.Router();
const Class = require("../models/class");
const Token = require("../models/token");

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

//update attendance
router.patch("/:classId/:studentNumber/:code", getClass, async (req, res) => {
  const studentNumber = req.params.studentNumber;
  const tokenCode = req.params.code;
  const objectIndex1 = res.searchClass.studentsAbsent.findIndex(
    (item) => item && item.number.toString() === studentNumber
  );
  const objectIndex2 = res.searchClass.studentsPresent.findIndex(
    (item) => item && item.number.toString() === studentNumber
  );
  if (objectIndex2 !== -1) {
    return res.status(400).json({ message: "Already checked in." });
  }
  if (objectIndex1 !== -1) {
    let codeCorrect = false;
    for (const element of res.searchClass.tokens) {
      let tempTocken = element;
      if (tempTocken.code == tokenCode && tempTocken.dateTime >= new Date()) {
        codeCorrect = true;
        const [removedObject] = res.searchClass.studentsAbsent.splice(
          objectIndex1,
          1
        );
        res.searchClass.studentsPresent.push(removedObject);
      }
    }
    if (codeCorrect == false) {
      return res.status(400).json({ message: "Code invalid." });
    }
  } else {
    return res.status(400).json({ message: "Student not found in any class." });
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
    searchClass = await Class.findById(req.params.classId);
    if (searchClass == null) {
      return res.status(404).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.searchClass = searchClass;
  next();
}

module.exports = router;
