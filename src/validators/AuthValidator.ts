import { checkSchema } from 'express-validator';

export const AuthValidator = {
    signup: checkSchema({
        name: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Name must be at least 2 characters long'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Invalid email'
        },
        password: {
            isLength: {
                options: { min: 8 }
            },
            errorMessage: 'Password must be at least 8 characters long'                        
        },
        state: {
            notEmpty: true,
            errorMessage: 'Invalid state'
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'Invalid email'
        },
        password: {
            isLength: {
                options: { min: 8 }
            },
            errorMessage: 'Password must be at least 8 characters long'                        
        }
    })
}