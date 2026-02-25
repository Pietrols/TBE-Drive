const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const { PrismaStoreSession } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");
const flash = require("connect-flash");
const { prisma } = require("./lib/prisma");
const authRoutes = require("./routes/auth");
// const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// middleware - body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// session configuration
const sessionStore = new PrismaStoreSession(prisma, {
  checkPeriod: 2 * 60 * 1000, // clean expired sessions every two minutes
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
    },
  }),
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Registration route
app.use("/", authRoutes);
app.use("/dashboardRoutes");

// Home route (redirect to dashboard)
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.redirect("login");
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1><a href="/">Go Home</a>');
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(500)
    .send("<h1>500 - Server Error</h1><p>Something went wrong!</p>");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
