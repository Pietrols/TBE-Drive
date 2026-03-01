const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const { isAuthenticated } = require("../middleware/auth");
const { upload, handleMulterError } = require("../config/multer");

// All routes require authentication
router.use(isAuthenticated);

// Upload file to folder (with error handling)
router.post(
  "/folders/:id/upload",
  upload.single("file"),
  handleMulterError,
  fileController.uploadFile,
);

// Download file
router.get("/files/:id/download", fileController.downloadFile);

// Delete file
router.post("/files/:id/delete", fileController.deleteFile);

module.exports = router;
