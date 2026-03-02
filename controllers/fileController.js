const { prisma } = require("../lib/prisma");
const { cloudinary } = require("../config/cloudinary");

// Upload file to folder (Cloudinary version)
const uploadFile = async (req, res) => {
  const { id: folderId } = req.params;

  try {
    // Check if file was uploaded
    if (!req.file) {
      req.flash("error_msg", "Please select a file to upload");
      return res.redirect(`/folders/${folderId}`);
    }

    // Verify folder exists and user owns it
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(folderId) },
    });

    if (!folder) {
      // Delete uploaded file from Cloudinary if folder doesn't exist
      if (req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      req.flash("error_msg", "Folder not found");
      return res.redirect("/folders");
    }

    if (folder.userId !== req.user.id) {
      // Delete uploaded file from Cloudinary if user doesn't own folder
      if (req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      req.flash("error_msg", "You do not have access to this folder");
      return res.redirect("/folders");
    }

    // Save file metadata to database
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        url: req.file.path, // Cloudinary URL
        folderId: parseInt(folderId),
        userId: req.user.id,
      },
    });

    req.flash("success_msg", `File "${file.name}" uploaded successfully`);
    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error("Error uploading file:", error);

    // Clean up file from Cloudinary if database save failed
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (deleteError) {
        console.error("Error deleting file from Cloudinary:", deleteError);
      }
    }

    req.flash("error_msg", "Failed to upload file");
    res.redirect(`/folders/${folderId}`);
  }
};

// Download file (Cloudinary version - redirect to URL)
const downloadFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });

    if (!file) {
      req.flash("error_msg", "File not found");
      return res.redirect("/folders");
    }

    // Check ownership
    if (file.userId !== req.user.id) {
      req.flash("error_msg", "You do not have access to this file");
      return res.redirect("/folders");
    }

    // Redirect to Cloudinary URL with download flag
    const downloadUrl = file.url.replace("/upload/", "/upload/fl_attachment/");
    res.redirect(downloadUrl);
  } catch (error) {
    console.error("Error fetching file:", error);
    req.flash("error_msg", "Failed to download file");
    res.redirect("/folders");
  }
};

// Delete file (Cloudinary version)
const deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });

    if (!file) {
      req.flash("error_msg", "File not found");
      return res.redirect("/folders");
    }

    // Check ownership
    if (file.userId !== req.user.id) {
      req.flash("error_msg", "You do not have access to this file");
      return res.redirect("/folders");
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
    const urlParts = file.url.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = "tbe-drive/" + publicIdWithExtension.split(".")[0];

    // Delete file from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    } catch (cloudinaryError) {
      console.error("Error deleting file from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await prisma.file.delete({
      where: { id: parseInt(id) },
    });

    req.flash("success_msg", "File deleted successfully");
    res.redirect(`/folders/${file.folderId}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    req.flash("error_msg", "Failed to delete file");
    res.redirect("/folders");
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  downloadFile,
};
