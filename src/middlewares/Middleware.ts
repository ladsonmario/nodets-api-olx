import { NextFunction, Request, Response } from 'express';
import State, { StateType } from '../models/State';
import { privateRouteJwt } from './AuthPassport';

export const Middlewares = {
    verifyIfExistState: async (req: Request, res: Response, next: NextFunction) => {
        const states = await State.find() as StateType[];        
        states.length === 0 ? next() : privateRouteJwt(req, res, next);        
    }
}