const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");

router.post("/signup", studentController.signupStudent);
router.post("/login", studentController.loginStudent);

router.delete("/deleteall", studentController.deleteAllStudent);

router.delete("/delete/:id", studentController.deletOneStudent);

router.get("/getall", studentController.getAllStudent);

module.exports = router;
