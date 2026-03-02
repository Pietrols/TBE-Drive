const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController");
const { isAuthenticated } = require("../middleware/auth");

// All routes require authentication
router.use(isAuthenticated);

// List all folders
router.get("/folders", folderController.listFolders);

// Create folder
router.get("/folders/new", folderController.showCreateForm);
router.post("/folders", folderController.createFolder);

// View folder detail
router.get("/folders/:id", folderController.showFolder);

// Edit folder
router.get("/folders/:id/edit", folderController.showEditForm);
router.post("/folders/:id/edit", folderController.updateFolder);

// Delete folder
router.post("/folders/:id/delete", folderController.deleteFolder);

module.exports = router;
