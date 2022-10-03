import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User, { UserType } from '../models/User';
import State, { StateType } from '../models/State';
import { validationResult, matchedData } from 'express-validator';
import { generateToken } from '../middlewares/AuthPassport';

export const AuthController = {
    signin: async (req: Request, res: Response) => {
        const erros = validationResult(req);

        if(!erros.isEmpty()) {
            res.json({ error: erros.mapped() });
            return;
        }

        const data = matchedData(req);
        const user: UserType | null = await User.findOne({ email: data.email });

        if(!user) {
            res.json({ error: 'E-mail e/ou senha inválidos!' });
            return;
        }

        const match: boolean = await bcrypt.compare(data.password, user.passwordHash);

        if(!match) {
            res.json({ error: 'E-mail e/ou senha inválidos!' });
            return;
        }

        const token: string = generateToken({ id: user._id, email: user.email });

        await User.updateOne({ email: user.email }, { token });             

        res.json({ token });
    },
    signup: async (req: Request, res: Response) => {
        const erros = validationResult(req);

        if(!erros.isEmpty()) {
            res.json({ error: erros.mapped() });
            return;
        }

        const data = matchedData(req);
        const user: UserType | null = await User.findOne({ email: data.email });        

        if(user) {
            res.json({ error: 'E-mail já existe, tente outro!' });
            return;
        }

        if(mongoose.Types.ObjectId.isValid(data.state)) {
            const stateItem = await State.findById(data.state) as StateType;            
            if(!stateItem) {
                res.json({ error: 'Estado inexistente!' } );
                return;
            }
        } else {
            res.json({ error: 'Código do estado está inválido!' } );
            return;
        }

        const passwordHash: string = await bcrypt.hash(data.password, 10);
        let token: string = generateToken({ email: data.email });
        const userAdmin = await User.find({ administrator: true }) as UserType[];

        const newUser: UserType = await User.create({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
            state: data.state,
            administrator: (userAdmin.length === 0) ? true : false
        });

        token = generateToken({ id: newUser._id, email: data.email });
        await User.updateOne({ email: newUser.email }, { token });
        
        res.json({ token });
    }
}