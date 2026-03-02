const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tbe-drive", // Folder name in Cloudinary
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "csv",
      "zip",
      "rar",
      "7z",
      "mp3",
      "wav",
      "ogg",
      "mp4",
      "mpeg",
      "mov",
      "avi",
    ],
    resource_type: "auto", // Automatically detect resource type
    public_id: (req, file) => {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.round(Math.random() * 1e9);
      const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension
      return `${timestamp}-${randomString}-${originalName}`;
    },
  },
});

module.exports = { cloudinary, storage };
