const { prisma } = require("../lib/prisma");

// List all user's folders
const listFolders = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { files: true },
        },
      },
    });

    res.render("folders/list", { folders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    req.flash("error_msg", "Failed to load folders");
    res.redirect("/dashboard");
  }
};

// Show create folder form
const showCreateForm = (req, res) => {
  res.render("folders/create");
};

// Create new folder
const createFolder = async (req, res) => {
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    req.flash("error_msg", "Folder name is required");
    return res.redirect("/folders/new");
  }

  try {
    // Check if user already has a folder with this name
    const existingFolder = await prisma.folder.findFirst({
      where: {
        name: name.trim(),
        userId: req.user.id,
      },
    });

    if (existingFolder) {
      req.flash("error_msg", "You already have a folder with this name");
      return res.redirect("/folders/new");
    }

    // Create folder
    await prisma.folder.create({
      data: {
        name: name.trim(),
        userId: req.user.id,
      },
    });

    req.flash("success_msg", `Folder "${name}" created successfully`);
    res.redirect("/folders");
  } catch (error) {
    console.error("Error creating folder:", error);
    req.flash("error_msg", "Failed to create folder");
    res.redirect("/folders/new");
  }
};

// Show folder detail (will enhance in 2.4)
const showFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
      include: {
        files: {
          orderBy: { uploadDate: "desc" },
        },
      },
    });

    // Check if folder exists
    if (!folder) {
      req.flash("error_msg", "Folder not found");
      return res.redirect("/folders");
    }

    // Check ownership
    if (folder.userId !== req.user.id) {
      req.flash("error_msg", "You do not have access to this folder");
      return res.redirect("/folders");
    }

    res.render("folders/detail", { folder });
  } catch (error) {
    console.error("Error fetching folder:", error);
    req.flash("error_msg", "Failed to load folder");
    res.redirect("/folders");
  }
};

// Show edit folder form
const showEditForm = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
    });

    if (!folder) {
      req.flash("error_msg", "Folder not found");
      return res.redirect("/folders");
    }

    // Check ownership
    if (folder.userId !== req.user.id) {
      req.flash("error_msg", "You do not have access to this folder");
      return res.redirect("/folders");
    }

    res.render("folders/edit", { folder });
  } catch (error) {
    console.error("Error fetching folder:", error);
    req.flash("error_msg", "Failed to load folder");
    res.redirect("/folders");
  }
};

// Update folder
const updateFolder = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    req.flash("error_msg", "Folder name is required");
    return res.redirect(`/folders/${id}/edit`);
  }

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
    });

    if (!folder) {
      req.flash("error_msg", "Folder not found");
      return res.redirect("/folders");
    }

    // Check ownership
    if (folder.userId !== req.user.id) {
      req.flash("error_msg", "You do not have access to this folder");
      return res.redirect("/folders");
    }

    // Check for duplicate name (excluding current folder)
    const existingFolder = await prisma.folder.findFirst({
      where: {
        name: name.trim(),
        userId: req.user.id,
        NOT: { id: parseInt(id) },
      },
    });

    if (existingFolder) {
      req.flash("error_msg", "You already have a folder with this name");
      return res.redirect(`/folders/${id}/edit`);
    }

    // Update folder
    await prisma.folder.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() },
    });

    req.flash("success_msg", "Folder updated successfully");
    res.redirect("/folders");
  } catch (error) {
    console.error("Error updating folder:", error);
    req.flash("error_msg", "Failed to update folder");
    res.redirect(`/folders/${id}/edit`);
  }
};

// Delete folder
const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { files: true },
        },
      },
    });

    if (!folder) {
      req.flash("error_msg", "Folder not found");
      return res.redirect("/folders");
    }

    // Check ownership
    if (folder.userId !== req.user.id) {
      req.flash("error_msg", "You do not have access to this folder");
      return res.redirect("/folders");
    }

    // Check if folder has files
    if (folder._count.files > 0) {
      req.flash(
        "error_msg",
        "Cannot delete folder with files. Delete files first.",
      );
      return res.redirect("/folders");
    }

    // Delete folder
    await prisma.folder.delete({
      where: { id: parseInt(id) },
    });

    req.flash("success_msg", "Folder deleted successfully");
    res.redirect("/folders");
  } catch (error) {
    console.error("Error deleting folder:", error);
    req.flash("error_msg", "Failed to delete folder");
    res.redirect("/folders");
  }
};

module.exports = {
  listFolders,
  showCreateForm,
  createFolder,
  showFolder,
  showEditForm,
  updateFolder,
  deleteFolder,
};
