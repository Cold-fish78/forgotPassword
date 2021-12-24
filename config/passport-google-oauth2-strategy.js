const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use a new strategy for googel login
passport.use(new googleStrategy({
    clientID: "1085636266663-c5qsumdb0cc8m6o7jtsajfseb84l5nkj.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:6002/users/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    // find a user
    User.findOne({
        email: profile.emails[0].value
    }).exec(function (err, user) {
        if (err) {
            console.log("error at googel Strategy" + err);
            return;
        }
        console.log(profile);
        // if found , set this user as req.user
        if (user) {
            return done(null, user);
        } else { 
            // if not found, create the user and set is as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function (err, user) {
                if (err) {
                    console.log("error in google strategy line 27" + err);
                    return;
                }
                return done(null, user);
            })
        }
    })
}
));
module.exports = passport;