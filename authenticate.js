const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./models/index')

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config/config.json')['jwt-sign'];

const User = db.User

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (userId) => {
    jwt.sign(userId, config.secretKey, { expiresIn: 3600 }, (err, token) => {
        if (err) {
            console.log("This error occurs at signing level", err)
        }
        console.log("This is the user id at atuh", userId)
        console.log("This is the token at auth level", token)
        return token
    })
};
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({ id: jwt_payload.id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });