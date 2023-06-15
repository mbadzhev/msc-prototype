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
router.patch("/:classId/:studentId/:code", getClass, async (req, res) => {
  const index1 = res.searchClass.studentsPresent.findIndex(
    (element) => (element = req.params.studentId)
  );
  //if already checked in
  if (index1 != -1) {
    return res.status(400).json({ message: "Already checked in." });
  }
  let codeCorrect = false;
  for (const element of res.searchClass.tokens) {
    let tempTocken = element;
    if (
      tempTocken.code == req.params.code &&
      tempTocken.dateTime >= new Date()
    ) {
      codeCorrect = true;
      const index2 = res.searchClass.studentsAbsent.findIndex(
        (element) => (element = req.params.studentId)
      );
      res.searchClass.studentsAbsent.splice(index2, 1);
      res.searchClass.studentsPresent.push(req.params.studentId);
    }
  }
  if (codeCorrect == false) {
    return res.status(400).json({ message: "Code invalid." });
  }
  try {
    const docUpdate = await res.searchClass.save();
    return res.json(docUpdate);
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
