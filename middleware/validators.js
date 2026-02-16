const { body, validationResult } = require("express-validator");

const registerValidator = [
  // username field
  body("name")
    .exists({ checkFalsy: true })
    .trim()
    .isAlpha()
    .withMessage("Username must be at least 2")
    .isLength({ min: 2, max: 20 }),

  // email field
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Valid email is required")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  // password field
  body("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long"),

  // confirm password field
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.passport) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

module.exports = registerValidator;
