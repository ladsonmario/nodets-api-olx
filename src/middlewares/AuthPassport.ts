import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User, { UserType } from "../models/User";

dotenv.config();

const notAuthorizedJson = { message: 'Não autorizado', status: 401 }
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'process.env.SECRET_KEY as string'
}

passport.use(new JwtStrategy(options, (jwt_payload, done) => {    
    User.findById(jwt_payload.id, (err: string, user: UserType) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(notAuthorizedJson, false);            
        }
    });
}));

export const generateToken = (data: object) => {
    return jwt.sign(data, 'process.env.SECRET_KEY as string');
}

export const privateRouteJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err: string, user: UserType) => {
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    })(req, res, next);
}

export default passport;