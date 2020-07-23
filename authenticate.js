const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const userService = require('./services/user-service')
const db = require('./models/index')
const config = require('./config/config.json')['jwt-sign'];

const User = db.User

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = async (userId) => {
    const { isAdmin } = await userService.getUser(userId)
    return jwt.sign({ userId, isAdmin }, config.secretKey, { expiresIn: config.expiresIn })

};
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    async (jwt_payload, done) => {
        try {
            const user = await userService.getUser(jwt_payload.userId)
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    }

));

exports.verifyUser = passport.authenticate('jwt', { session: false });