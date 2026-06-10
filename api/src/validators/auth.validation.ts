import { z } from 'zod';

export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(255, 'Name is too long'),

    email: z.email('Invalid email address').max(255),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(255)
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a number'),

    role: z.enum(['user', 'admin']).optional().default('user'),
});

export const loginSchema = z.object({
    email: z.email('Invalid email address'),

    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
