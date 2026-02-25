const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const registerValidator = require("../middleware/validators");
const passport = require("passport");

// registration routes
router.get("/register", authController.showRegisterForm);
router.post("/register", registerValidator, authController.registerUser);

// login routes
router.get("/login", authController.showLoginForm);
router.post(
  "login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

// logout route
router.post("/logout", authController.logoutUser);

module.exports = router;
