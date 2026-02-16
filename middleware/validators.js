const { body, validationResult } = require("express-validator");

const registerValidator = [
  // username field
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Username must be at between 2 and 20 Characters"),

  // email field
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  // password field
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long"),

  // confirm password field
  body("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports = registerValidator;
