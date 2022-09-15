import { validationResult, matchedData } from 'express-validator';
import { Request, Response } from 'express';
import State, { StateType } from '../models/State';
import mongoose from 'mongoose';
import { UserType } from '../models/User';

export const StateController = {
    getStates: async (req: Request, res: Response) => {
        const states: StateType[] = await State.find();
        res.json({ states });
    },
    addState: async (req: Request, res: Response) => {        
        const erros = validationResult(req);
        
        if(!erros.isEmpty()) {
            res.json({ error: erros.mapped() });
            return;
        }

        const data = matchedData(req);
        const user = req.user as UserType;
        const states = await State.find() as StateType[];

        if(states.length === 0 || user.administrator) {
            const name: string = data.name.toUpperCase();

            const stateItem: StateType | null = await State.findOne({ name });

            if(stateItem) {
                res.json({ error: 'Estado já está cadastrado no sistema!' });
                return;
            }

            if(name.length !== 2) {
                res.json({ error: 'Inserir somente sigla do estado!' });
                return;
            }

            const state = await State.create({ name }) as StateType;
            
            res.json({ _id: state._id, name: state.name });
        } else {
            res.json({ error: 'Você não possui permissões para essa ação, entre em contado com um admistrador!' });
            return;
        }
    },
    delState: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as UserType;

        if(user.administrator) {
            if(mongoose.Types.ObjectId.isValid(id)) {
                const stateItem = await State.findById(id) as StateType;
                if(!stateItem) {
                    res.json({ error: 'Estado inexistente!' });
                    return;
                } else {
                    await State.findByIdAndDelete(id);
                    res.json({});
                }
            } else {
                res.json({ error: 'Código do estado está inválido!' });
                return;
            }
        } else {
            res.json({ error: 'Você não possui permissões para essa ação, entre em contado com um admistrador!' });
            return;
        }
    }
}
