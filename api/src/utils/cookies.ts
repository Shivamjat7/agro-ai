import { Request, Response, CookieOptions } from 'express';

export const cookieOptions = {
    accessToken: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 15 * 60 * 1000,
    } satisfies CookieOptions,

    refreshToken: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    } satisfies CookieOptions,
};

export const cookies = {
    set: (res: Response, name: string, value: string, options: CookieOptions) => {
        res.cookie(name, value, options);
    },

    clear: (res: Response, name: string, options?: CookieOptions) => {
        res.clearCookie(name, options);
    },

    get: (req: Request, name: string): string | undefined => {
        return req.cookies?.[name];
    },
};
