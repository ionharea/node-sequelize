const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const dbUser = require('./db-services/user-service')
const db = require('./models/index')
const config = require('./config/config.json')['jwt-sign'];

const User = db.User

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = async (userId) => {
    const { isAdmin } = await dbUser.getUser(userId)
    return jwt.sign({ userId, isAdmin }, config.secretKey, { expiresIn: 3600 })

};
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    async (jwt_payload, done) => {
        try {
            const user = await User.findOne({ where: { id: jwt_payload.userId } }, { raw: true })
            return done(null, user)
        } catch(err) {
            return done(err, false)
        }
        
            // (err, user) => {
            // console.log()
            // if (err) {
            //     return done(err, false);
            // }
            // else if (user) {
            //     console.log(user);
            //     return done(null, user);
            // }
            // else {
            //     return done(null, false);
            // }
            // }

        // );
        // console.log("This is", user);
        // return done(null, user);
    }

));

exports.verifyUser = passport.authenticate('jwt', { session: false });