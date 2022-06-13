import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';

import State, { StateType } from '../models/State';
import User, { UserType } from '../models/User';
import Ads from '../models/Ads';
import Category from '../models/Category';

export const getStates = async (req: Request, res: Response) => {
    let states = await State.find();

    res.json({ states });
}

export const info = async (req: Request, res: Response) => {    
    
    const userReq = req.user as UserType;

    const user = await User.findOne({ email: userReq.email });

    if(user) {
        const state = await State.findById(user.state) as StateType;
        const ads = await Ads.find({ idUser: user._id.toString() });
        
        let adList = [];

        for(let i in ads) {
            const cat = await Category.findById(ads[i].category) as any;

            adList.push({
                ...ads[i],
                category: cat.slug
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            state: state.name,
            ads: adList
        });        
    }    
}

export const editAction = async (req: Request, res: Response) => {
    const erros = validationResult(req);

    if(!erros.isEmpty()) {
        res.json({ error: erros.mapped() });
        return;
    }

    const data = matchedData(req);
    
    const userReq = req.user as UserType;    

    let updates: any = { };

    if(data.name) {
        updates.name = data.name;
    }
    if(data.email) {
        const checkEmail = await User.findOne({ email: data.email });
        
        if(checkEmail) {
            res.json({ error: 'Existent email' });
            return;
        }

        updates.email = data.email;
    }
    if(data.state) {
        if(mongoose.Types.ObjectId.isValid(data.state)) {
            const checkState = await State.findById(data.state);

            if(!checkState) {
                res.json({ erorr: 'Inexistent state' });
                return;
            }

            updates.state = data.state;
        }
    }

    if(data.password) {
        updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await User.findOneAndUpdate({ email: userReq.email },{ $set: updates });
    res.json({ actualized: true });
}