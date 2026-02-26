// show dashboard
const showDashboard = (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
};

module.exports = { showDashboard };
