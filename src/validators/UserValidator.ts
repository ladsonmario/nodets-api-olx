import { checkSchema } from 'express-validator';

export const UserValidator = {
    editAction: checkSchema({        
        name: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Name must be at least 2 characters long',
            optional: true
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Invalid email',
            optional: true
        },
        password: {
            isLength: {
                options: { min: 8 }
            },
            errorMessage: 'Password must be at least 8 characters long',
            optional: true                        
        },
        state: {
            notEmpty: true,
            errorMessage: 'Invalid state',
            optional: true
        }
    })
}