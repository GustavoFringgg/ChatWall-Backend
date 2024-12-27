const passport = require("passport");
const User = require("../model/users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Oauthid,
      clientSecret: process.env.Oauthpassword,
      callbackURL: "http://localhost:3000/users/google/callback",
    },
    async function (accessToken, refreshToken, profile, next) {
      try {
        console.log("user.js-profile", profile);
        const user = await User.findOrCreate({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value });
        console.log("user.js", user);
        return next(null, user);
      } catch (error) {
        return next(error);
      }
    }
  )
);
