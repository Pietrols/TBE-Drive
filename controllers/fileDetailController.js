const { prisma } = require("../lib/prisma");

// Show file detail page
const showFileDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) },
      include: {
        folder: true,
        user: {
          select: { name: true, email: true },
        },
      },
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

    // Format file size
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    // Determine if file is an image for preview
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    const isImage = imageExtensions.includes(fileExtension);

    // Get Cloudinary thumbnail for images
    let thumbnailUrl = null;
    if (isImage) {
      // Transform Cloudinary URL to create thumbnail
      thumbnailUrl = file.url.replace(
        "/upload/",
        "/upload/w_400,h_400,c_limit/",
      );
    }

    res.render("files/detail", {
      file,
      formattedSize: formatFileSize(file.size),
      isImage,
      thumbnailUrl,
    });
  } catch (error) {
    console.error("Error fetching file detail:", error);
    req.flash("error_msg", "Failed to load file details");
    res.redirect("/folders");
  }
};

module.exports = { showFileDetail };
