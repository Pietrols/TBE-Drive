const multer = require("multer");
const path = require("path");

// Allowed MIME types
const ALLOWED_FILE_TYPES = {
  // Images
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],

  // Documents
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],

  // Text files
  "text/plain": [".txt"],
  "text/csv": [".csv"],
  "text/html": [".html"],
  "text/css": [".css"],
  "text/javascript": [".js"],
  "application/json": [".json"],

  // Archives
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
  "application/x-7z-compressed": [".7z"],

  // Audio
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/ogg": [".ogg"],

  // Video
  "video/mp4": [".mp4"],
  "video/mpeg": [".mpeg"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
};

// File size limits (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Configure storage (still using disk for now, will change in 3.2)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter with validation
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_FILE_TYPES[file.mimetype]) {
    const error = new Error(
      "File type not allowed. Allowed types: images, documents, text files, archives, audio, video",
    );
    error.code = "FILE_TYPE_NOT_ALLOWED";
    return cb(error, false);
  }

  // Check file extension matches MIME type
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ALLOWED_FILE_TYPES[file.mimetype];

  if (!allowedExtensions.includes(fileExtension)) {
    const error = new Error("File extension does not match file type");
    error.code = "FILE_EXTENSION_MISMATCH";
    return cb(error, false);
  }

  // Accept file
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only one file at a time
  },
});

// Error handler for multer errors -
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash(
        "error_msg",
        `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
    } else if (err.code === "LIMIT_FILE_COUNT") {
      req.flash("error_msg", "Too many files. Upload one file at a time");
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      req.flash("error_msg", "Unexpected field name");
    } else {
      req.flash("error_msg", "Error uploading file: " + err.message);
    }
    return res.redirect("back");
  } else if (err) {
    // Custom validation errors
    if (
      err.code === "FILE_TYPE_NOT_ALLOWED" ||
      err.code === "FILE_EXTENSION_MISMATCH"
    ) {
      req.flash("error_msg", err.message);
      return res.redirect("back");
    }
    // Other errors
    return next(err);
  }
  next();
};

module.exports = {
  upload,
  handleMulterError,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
};
