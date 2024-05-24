import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../utils/constants.js';
import { findUser } from '../models/index.js';

export const authMiddleware = (roles) => {
    return (req, res, next) => {
        const accessToken = req.headers.authorization?.split(' ')[1] || req.session.accessToken;
        if (!accessToken) return next({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: 'Authorization failed!'
        });

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'token expired'
            });

            req.user = { ...decoded };

            const user = await findUser({ _id: req.user.id });
            if (!user) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Unauthorized access!'
            });

            if (!roles.includes(req.user.role)) return next({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: 'Unauthorized access!'
            });

            // next middleware is called
            next();
        });
    }
}