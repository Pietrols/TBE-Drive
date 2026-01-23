const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Test route
app.get("/", (req, res) => {
  res.send(
    "<h1>TBE-Drive Server Running!</h1><p>Database connection will be tested on first Prisma query.</p>",
  );
});

// Test database connection
app.get("/test-db", async (req, res) => {
  const { prisma } = require("./lib/prisma");

  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    res.json({
      status: "Database connected!",
      userCount: userCount,
    });
  } catch (error) {
    res.status(500).json({
      status: "Database connection failed",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test database at http://localhost:${PORT}/test-db`);
});
