import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users } from './../models/User.model';
import { logger } from './../config/logger';

type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    role?: string;
};
type LoginInput = {
    email: string;
    password: string;
};
export const hashPassword = async (password: string) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error('error hashing the password :', error);
        throw new Error('Error hasshing', { cause: error });
    }
};

export const createUser = async ({ name, email, password, role = 'user' }: CreateUserInput) => {
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length) throw new Error('user already exist');
        const password_hashed = await hashPassword(password);
        const [newUser] = await db
            .insert(users)
            .values({ name, email, password: password_hashed, role })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
            });
        logger.info(`User with ${newUser.email} created successfully`);
        return newUser;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const signinUser = async ({ email, password }: LoginInput) => {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
        throw new Error('Invalid email or password');
    }
    

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
    };
};
