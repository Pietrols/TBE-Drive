const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");

//show register form
exports.showRegisterForm = (req, res) => {
  res.render("register", { errors: [], formData: {} });
};

// register user
exports.registerUser = async (req, res, next) => {
  // check validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("register", {
      errors: errors.array(),
      formData: req.body,
    });
  }

  const { name, email, password } = req.body;

  try {
    //check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.render("signup", {
        errors: [{ msg: "Email already registered" }],
        formData: req.body,
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

    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (err) {
    console.error("Registration error:", err);
    // Return error
    return res.render("signup", {
      errors: [{ msg: "Registration failed. Please try again" }],
      formData: req.body,
    });
  }
};
