const passport  = require('passport');
const UserModel = require('../models/user-model.js');
const bcrypt    = require('bcrypt');

passport.serializeUser((userFromDb, done) => {
    done(null, userFormDb._id);
});