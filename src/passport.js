import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import User from "./models/user.model.js";


passport.use(
    new GoogleStrategy(
        {
            clientID:process.env.clientID,
            clientSecret:process.env.clientSecret,
            callbackURL: "/auth/google/callback",

        },
        async (accessToken , refreshToken , profile, done) => {
            try {

                let user = await User.findOne({googleId: profile.id});
                if(!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                    });
                    await user.save();
                }
                done(null,user);
                
            } catch (error) {

                 done(err, null);
                
            }
        }
    )
);

passport.serializeUser((user,done) =>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done) => {
    const user = await User.findById(id);
    done(null,user)
} );