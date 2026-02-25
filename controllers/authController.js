const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

//show register form
showRegisterForm = (req, res) => {
  res.render("register", { errors: [], oldInput: {} });
};

// register user
registerUser = async (req, res, next) => {
  // check validation results
  const errors = validationResult(req);
  // check validation errors
  if (!errors.isEmpty()) {
    return res.render("register", {
      errors: errors.array(),
      oldInput: req.body,
    });
  }

  const { name, email, password } = req.body;

  try {
    //check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.render("register", {
        errors: [{ msg: "Email already registered" }],
        oldInput: req.body,
      });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // success - redirect to login page with flash message
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.error("Registration error:", err);
    // Return error
    return res.render("register", {
      errors: [{ msg: "Registration failed. Please try again" }],
      oldInput: req.body,
    });
  }
};

// shouw login form
const showLoginForm = (req, res) => {
  res.render("login");
};

// login user - passport.authenticate middleware
const loginUser = (req, res) => {
  res.redirect("/dashboard");
};

// Logout user
const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }

      req.flash("success_msg", "You have been logged out");
      res.redirect("/login");
    });
  });
};

module.exports = {
  showLoginForm,
  showRegisterForm,
  registerUser,
  loginUser,
  logoutUser,
};
