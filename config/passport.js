const passport = require("passport");
const LocalStrategy = require("passport-local");
const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// configure Local Strategy
passport.use(
  new LocalStrategy(
    { userNameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUserByEmail(email);

        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const isMatch = await bcrypt.compare(passport, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        if (user && isMatch) {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);
