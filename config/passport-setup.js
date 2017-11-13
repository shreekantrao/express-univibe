const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/network');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({'social_ids.google': profile.id},{email:1,fullname:1,batch:1,course:1,slug:1,gender:1}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                console.log('Create new user',profile.id);
                // new User({
                //     googleId: profile.id,
                //     username: profile.displayName,
                //     thumbnail: profile._json.image.url
                // }).save().then((newUser) => {
                //     console.log('created new user: ', newUser);
                //     done(null, newUser);
                // });
            }
        });
    })
);
