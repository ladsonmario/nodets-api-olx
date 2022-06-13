import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { generateToken } from '../middlewares/AuthPassport';

import User from '../models/User';
import State from '../models/State';

export const signin = async (req: Request, res: Response) => {
    const erros = validationResult(req);

    if(!erros.isEmpty()) {
        res.json({ error: erros.mapped() });
        return;
    }

    const data = matchedData(req);
    const user = await User.findOne({ email: data.email });

    if(!user) {
        res.json({ error: 'Invalid email and/or password' });
        return;
    }

    const match = await bcrypt.compare(data.password, user.passwordHash);

    if(!match) {
        res.json({ error: 'Invalid email and/or password' });
        return;
    }    

    const token = generateToken({ id: user._id, email: user.email });

    user.token = token;
    await user.save();

    res.json({ email: data.email, token });
}

export const signup = async (req: Request, res: Response) => {
    const erros = validationResult(req);

    if(!erros.isEmpty()) {
        res.json({ error: erros.mapped() });
        return;
    }

    const data = matchedData(req);
    const user = await User.findOne({ email: data.email });
    
    if(user) {
        res.json({ error: 'Existent email' });
        return;
    }

    if(mongoose.Types.ObjectId.isValid(data.state)) {
        const stateItem = await State.findById(data.state);

        if(!stateItem) {
            res.json({ state: { msg: 'Inexistent state' } });
            return;
        }

    } else {
        res.json({ state: { msg: 'Invalid state code' } });
        return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const token = generateToken({ email: data.email });

    const newUser = new User({
        name: data.name,
        email: data.email,
        passwordHash,
        token: token,
        state: data.state
    });

    await newUser.save();
    res.json({ token });
}