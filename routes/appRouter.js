const Router = require("express");
const appRouter = Router();

// Root redirect
appRouter.get("/", (req, res) => {
  return res.redirect("/home");
});

module.exports = appRouter;
