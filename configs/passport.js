const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

module.exports = function (passport) {
  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (user.state !== "verified") {
            return done(null, false, {
              message: "Please verify your email to login",
            });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "local-register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { username, confirm_password } = req.body;

          if (password !== confirm_password) {
            return done(null, false, {
              message: "Email or password do not match",
            });
          }

          const existingUser = await User.findOneWithUsernameOrEmail(
            username,
            email
          );
          if (existingUser) {
            return done(null, false, {
              message: "Email or username already registered",
            });
          }

          const user = await User.createUser({
            username,
            email,
            password,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
