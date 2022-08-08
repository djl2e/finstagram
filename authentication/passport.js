const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/user');

dotenv.config();

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false, { message: 'Incorrect username' });

      if (typeof password === 'number') {
        password = password.toString();
      }

      console.log(password, user.password);

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) return done(null, user);
        console.log(res);
        return done(null, false, { message: 'Incorrect password' });
      });
    });
  }),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    (jwtPayload, done) => User.findById(jwtPayload.user._id)
      .exec((err, user) => {
        if (err) return done(err);
        return done(null, user);
      }),
  ),
);

module.exports = passport;
