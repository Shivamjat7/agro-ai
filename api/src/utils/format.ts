import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
    const errors: Record<string, string[]> = {};

    for (const issue of error.issues) {
        const field = issue.path.join('.');

        if (!errors[field]) {
            errors[field] = [];
        }

        errors[field].push(issue.message);
    }

    return {
        success: false,
        message: 'Validation failed',
        errors,
    };
};
