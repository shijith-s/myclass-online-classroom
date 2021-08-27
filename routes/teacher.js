const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher");

router.post("/signup", teacherController.signupTeacher);
router.post("/login", teacherController.loginTeacher);

router.delete("/deleteall", teacherController.deleteAllTeacher);

router.delete("/delete/:id", teacherController.deletOneTeacher);

router.get("/getall", teacherController.getAllTeacher);

module.exports = router;
