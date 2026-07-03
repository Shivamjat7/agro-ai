import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { loginSchema, signupSchema } from '../validators/auth.validation';
import { createUser, signinUser } from '../services/auth.service';
import { jwttoken } from './../utils/jwt';
import { cookies } from '../utils/cookies';
import { formatZodError } from './../utils/format';

export const Signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                detail: formatZodError(validationResult.error),
            });
        }
        const { name, email, password, role } = validationResult.data;
        const user = await createUser({ name, email, password, role });

        const token = jwttoken.sign({ id: user.id });
        cookies.set(res, 'token', token, {});

        logger.info(`user registered succesfully:${email}`);
        res.status(201).json({ status: 'created', user });
    } catch (error) {
        logger.error('Signup Error', error);
        next(error);
    }
};
export const Signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationResult = loginSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                detail: formatZodError(validationResult.error),
            });
        }

        const { email, password } = validationResult.data;

        const user = await signinUser({
            email,
            password,
        });

        const token = jwttoken.sign({
            id: user.id,
        });

        cookies.set(res, 'token', token, {});

        logger.info(`user login successfully: ${email}`);

        return res.status(200).json({
            status: 'success',
            user,
        });
    } catch (error) {
        logger.error('Signin Error', error);
        next(error);
    }
};

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        cookies.clear(res, 'token');

        logger.info('User logged out');

        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    } catch (error) {
        logger.error('Logout Error', error);
        next(error);
    }
};
