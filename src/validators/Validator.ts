import { checkSchema } from 'express-validator';

export const Validator = {
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido!'
        },
        password: {
            isLength: { options: { min: 6 } },
            errorMessage: 'Senha deve conter ao menos 6 caracteres!'
        }
    }),
    signup: checkSchema({        
        name: {
            trim: true,
            isLength: { options: { min: 2 } },
            errorMessage: 'Nome precisa possuir ao menos 2 caracteres!'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido!'
        },
        password: {
            isLength: { options: { min: 6 } },
            errorMessage: 'Senha deve conter ao menos 6 caracteres!'
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado inválido!'
        }
    }), 
    editUser: checkSchema({
        name: {
            trim: true,
            isLength: { options: { min: 2 } },
            errorMessage: 'Nome precisa possuir ao menos 2 caracteres!',
            optional: true
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido!',
            optional: true
        },
        password: {
            isLength: { options: { min: 6 } },
            errorMessage: 'Senha deve conter ao menos 6 caracteres!',
            optional: true
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado inválido!',
            optional: true
        }
    }),
    addState: checkSchema({
        name: {
            trim: true,
            notEmpty: true,
            isLength: { options: { min: 2 } },
            errorMessage: 'Estado deve conter somente 2 caracteres!'
        }
    })   
}