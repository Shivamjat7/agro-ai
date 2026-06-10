import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';
const JWT_SECRET = process.env.JWT_SECRET || 'nflkjaljlajllsjlegjejkfdnkjnkjnrjwhiu4y4ut6o75';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
    sign: (payload: string) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (e) {
            logger.error('failed to authenticate token ', e);
            throw new Error('failed to authenticate token');
        }
    },
    verify: token => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            logger.error('failed to authenticate token', error);
            throw new Error('failed to authenticate');
        }
    },
};
