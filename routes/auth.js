const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const registerValidator = require("../middleware/validators");

// get register page
router.get("/register", authController.showRegisterForm);

// post register page
router.post("/register", registerValidator, authController.registerUser);

module.exports = router;
