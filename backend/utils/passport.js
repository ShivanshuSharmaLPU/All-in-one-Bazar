// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../models/userModel.js";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//       session: false,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             firstName: profile.name.givenName || profile.displayName,
//             lastName: profile.name.familyName || "",
//             email,
//             password: `GOOGLE_${profile.id}`,
//             isVerified: true,
//             profilePic: profile.photos?.[0]?.value || "",
//           });
//         } else if (!user.isVerified) {
//           user.isVerified = true;
//           await user.save();
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// export default passport;

import passport from "passport";

// Google OAuth disabled
export default passport;