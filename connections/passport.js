const passport = require("passport");
const User = require("../model/users");
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
dotenv.config({ path: "./config.env" });
let OAUTH_CALLBACK_URL;
if (process.env.NODE_ENV === "production") {
  OAUTH_CALLBACK_URL = "https://chatwall-backend.onrender.com/users/google/callback";
} else {
  OAUTH_CALLBACK_URL = "http://localhost:3000/users/google/callback";
}
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Oauthid,
      clientSecret: process.env.Oauthpassword,
      callbackURL: OAUTH_CALLBACK_URL,
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
