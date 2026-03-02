const { prisma } = require("../lib/prisma");

// Show dashboard with stats
const showDashboard = async (req, res) => {
  try {
    // Get folder count
    const folderCount = await prisma.folder.count({
      where: { userId: req.user.id },
    });

    // Get file count
    const fileCount = await prisma.file.count({
      where: { userId: req.user.id },
    });

    // Get total storage used
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      select: { size: true },
    });

    const totalStorage = files.reduce((sum, file) => sum + file.size, 0);

    // Format storage size
    const formatBytes = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    res.render("dashboard", {
      user: req.user,
      folderCount,
      fileCount,
      totalStorage: formatBytes(totalStorage),
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.render("dashboard", {
      user: req.user,
      folderCount: 0,
      fileCount: 0,
      totalStorage: "0 Bytes",
    });
  }
};

module.exports = { showDashboard };
