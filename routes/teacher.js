const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher");
const checkAuth = require("../middlewares/check-auth");
const attachment = require("../middlewares/attachments");

router.post("/signup", teacherController.signupTeacher);
router.post("/login", teacherController.loginTeacher);
router.get("/getallData", checkAuth, teacherController.getAllData);

// router.delete("/deleteall", teacherController.deleteAllTeacher);
// router.delete("/delete/:id", teacherController.deletOneTeacher);
// router.get("/getall", teacherController.getAllTeacher);

router.post("/createclass", checkAuth, teacherController.createClass);
router.delete("/deleteclass", checkAuth, teacherController.deleteClass);

router.post(
  "/createassignment",
  checkAuth,
  attachment.attachment,
  teacherController.createAssignment
);

module.exports = router;
