import passport from "passport";
import passportJwt from "passport-jwt";
import config from "../config";
import UserRepository from "../repositories/UserRepository";

const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: config.jwtSecret
};

export function init(app) {
  app.use(passport.initialize());
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await UserRepository.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}

export function authJwt() {
  return passport.authenticate("jwt", { session: false });
}
