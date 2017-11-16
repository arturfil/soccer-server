const passport  = require('passport');
const UserModel = require('../models/user-model.js');
const bcrypt    = require('bcrypt');

passport.serializeUser((userFromDb, done) => {
    done(null, userFormDb._id);
});

passport.deserializeUser((idFromBowl, done) => {
    UserModel.findById(
        idFromBowl,

        (err, userFromDb) => {
            if (err) {
                done(err);
                return;
            }
            done(null, userFromDb);
        }
    )
});

const LocalStrategy = require('passport-local').Strategy;
//passport.use() sets up a new strategy
passport.use(
    new LocalStrategy(
        { 
            usernameField: 'loginEmail',
            passportField: 'loginPassword'
        },
        (emailValue, passValue, done) => {
            UserModel.findOne(
                { email: emailValue },
                (err, userFromDb) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    if(userFromDb === null ) {
                        done(null, false, { message: 'Password is wrong'});
                        return;
                    }
                    done(null, userFromDb);
                }
            )
        }
    )
)

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.google_client_ID,
            clientSecret: process.env.google_client_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accesToken, refreshToken, profile, done) => {
            console.log('Google user info: ');
            console.log( profile.emails[0].value);
            UserModel.findOne(
                { googleID: profile.id },
                (err, userFromDb ) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    if(userFromDb) {
                        done(null, userFromDb);
                        return;
                    }
                    const theUser = new UserModel({
                        googleID: profile.id,
                        email: profile.emails[0].value
                    });
                    theUser.save((err) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        done(null, theUser);
                    })
                }
            )
        }
    )
)