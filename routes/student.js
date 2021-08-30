const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");
const checkAuth = require("../middlewares/check-auth");

router.post("/signup", studentController.signupStudent);
router.post("/login", studentController.loginStudent);
router.get("/getallData", checkAuth, studentController.getAllData);

// router.delete("/deleteall", studentController.deleteAllStudent);
// router.delete("/delete/:id", studentController.deletOneStudent);
// router.get("/getall", studentController.getAllStudent);

router.post("/joinclass", checkAuth, studentController.joinClass);
router.delete("/leaveclass", checkAuth, studentController.leaveClass);

module.exports = router;
