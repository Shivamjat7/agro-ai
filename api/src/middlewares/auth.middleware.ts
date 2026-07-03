import { Request, Response, NextFunction } from 'express';
import { jwttoken } from '../utils/jwt';
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new Error('Authentication required'));
        }

        const payload = jwttoken.verify(token) as {
            id: string;
        };

        req.user = {
            id: payload.id,
        };

        next();
    } catch (error) {
        next(error);
    }
};
