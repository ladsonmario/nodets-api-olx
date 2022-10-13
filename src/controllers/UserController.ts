import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User, { UserType } from '../models/User';
import State, { StateType } from '../models/State';
import Category, { CategoryType } from '../models/Category';
import Ad, { AdType } from '../models/Ad';
import { validationResult, matchedData } from 'express-validator';

export const UserController = {    
    infoUser: async (req: Request, res: Response) => {
        const user = req.user as UserType;        

        if(user) {
            const state = await State.findById(user.state) as StateType;            
            const ads = await Ad.find({ idUser: user._id.toString() }) as AdType[];

            let adList: AdType[] = [];

            for(let i in ads) {
                const cat = await Category.findById(ads[i].category) as CategoryType;                                

                adList.push({
                    _id: ads[i]._id,
                    idUser: ads[i].idUser,
                    state: ads[i].state,                    
                    category: cat.slug,
                    dateCreated: ads[i].dateCreated,
                    title: ads[i].title,
                    price: ads[i].price,
                    priceNegotiable: ads[i].priceNegotiable,
                    description: ads[i].description,
                    views: ads[i].views,
                    status: ads[i].status,
                    images: ads[i].images
                });
            }           

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                state: state.name,
                ads: adList
            });
        }        
    },
    editUser: async (req: Request, res: Response) => {
        const erros = validationResult(req);

        if(!erros.isEmpty()) {
            res.json({ error: erros.mapped() });
            return;
        }

        const data = matchedData(req);
        const user = req.user as UserType;

        let updates = {} as UserType;

        if(data.name) {
            updates.name = data.name;
        }

        if(data.email) {
            const checkEmail: UserType | null = await User.findOne({ email: data.email });

            if(checkEmail) {
                res.json({ error: 'Esse e-mail já existe, por favor tente outro!' });
                return;
            }

            updates.email = data.email;
        }

        if(data.state) {
            if(mongoose.Types.ObjectId.isValid(data.state)) {
                const stateItem = await State.findById(data.state) as StateType;
                if(!stateItem) {
                    res.json({ error: 'Estado inexistente!' } );
                    return;
                } else {
                    updates.state = data.state;
                }
            } else {
                res.json({ error: 'Código do estado está inválido!' } );
                return;
            }
        }

        if(data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }

        await User.findOneAndUpdate({ email: user.email }, { $set: updates });
        res.json({ atualização: true });
    },
    delUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as UserType;        
        const idUserLogged: string = user._id.toString();        

        if(idUserLogged === id) {
            if(mongoose.Types.ObjectId.isValid(id)) {
                const checkUser = await User.findById(id) as UserType;
                if(!checkUser) {
                    res.json({ error: 'Usuário inexistente!' });
                    return;
                } else {
                    await User.findByIdAndDelete(id);
                    res.json({});
                }
            } else {
                res.json({ error: 'Código do usuário está inválido!' });
                return;
            }
        } else {
            res.json({ error: 'Para excluir sua conta você precisa está logado nela!' });
            return;
        }        
    },
    addAdminUser: async (req: Request, res: Response) => {
        const { id } = req.body;
        const user = req.user as UserType;

        if(user.administrator) {
            if(mongoose.Types.ObjectId.isValid(id)) {
                const checkUser = await User.findById(id) as UserType;
                if(!checkUser) {
                    res.json({ error: 'Usuário inexistente!' });
                    return;
                } else {
                    await User.findByIdAndUpdate(id, { administrator: true });
                    res.json({ status: 'Permissão de administrador adicionada!' });                    
                }
            } else {
                res.json({ error: 'Código do usuário está inválido!' });
                return;
            }
        } else {
            res.json({ error: 'Você não possui permissões para essa ação, entre em contado com um admistrador!' });
            return;
        }
    }
}