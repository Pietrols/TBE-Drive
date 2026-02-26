const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { isAuthenticated } = require("../middleware/auth");

// Dashboard route (protected)
router.get("/dashboard", isAuthenticated, dashboardController.showDashboard);

module.exports = router;
