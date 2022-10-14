import mongoose, { ObjectId } from 'mongoose';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { unlink } from 'fs/promises';
import User, { UserType } from '../models/User';
import Category, { CategoryType } from '../models/Category';
import State, { StateType } from '../models/State';
import Ad, { AdType } from '../models/Ad';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ResultWithContext } from 'express-validator/src/chain';

dotenv.config();

export const AdController = {
    addAd: async (req: Request, res: Response) => {
        const user = req.user as UserType;
        const files = req.files as Express.Multer.File[];
        let { title, price, priceneg, desc, cat } = req.body;

        if(!title || !cat) {
            res.json({ error: 'Preencher título e categoria!' });
            return;
        }

        if(mongoose.Types.ObjectId.isValid(cat)) {
            const catItem = await Category.findById(cat) as CategoryType;
            if(!catItem) {
                res.json({ error: 'Categoria inexistente!' });
                return;
            }
        } else {
            res.json({ error: 'Código da categoria está inválido!' });
            return;
        }

        if(!desc) {
            res.json({ error: 'Adicione uma descrição para seu produto, isso ajuda para ele ser vendido mais rápido!' });
            return;
        }

        if(price === 'NaN' || price === NaN || price === '"NaN"') {
            res.json({ error: 'Preço não pode possuir o valor NaN!' });
            return;
        }

        if(price) {
            price = price.replace('.', '').replace(',', '').replace(' ', '').replace('R$', '');
            price = parseFloat(price);
        } else {
            price = 0;
        }

        const newAd: AdType = new Ad({
            idUser: user._id,
            state: user.state,
            status: true,            
            dateCreated: new Date(),
            title,
            category: cat,
            price,
            priceNegotiable: (priceneg === 'true') ? true : false,
            description: desc,
            views: 0
        });
        
        if(files.length > 0) {            
            for(let i in files) {
                const url: string = `midia/${v4()}.jpg`;
                await sharp(files[i].path)
                    .resize(500, 500, { fit: 'contain' })
                    .toFormat('jpg')
                    .toFile(`./public/${url}`); 
                    
                const newUrl = `${process.env.BASE}/${url}`;
                newAd.images.push({ url: newUrl, default: false });

                await unlink(files[i].path);
            }
        } else {
            res.json({ error: 'Você precisa enviar ao menos uma imagem do seu produto!' });            
            return;
        }

        if(newAd.images.length > 0) {
            newAd.images[0].default = true;
        }   
        
        await Ad.create(newAd);
        res.json({ id: newAd._id });
    },
    getAds: async (req: Request, res: Response) => {
        let { sort = 'ASC', offset = 0, limit = 8, q, cat, state } = req.query;
        let total: number = 0;
        
        type FilterType = {
            title: Object;
            category: string;
            state: string;
        }
        type AdsType = {
            _id: ObjectId;
            title: string;
            price: number;
            priceNegotiable: boolean;
            image: string;
        }

        if(offset < 0) {
            res.json({ error: 'ATENÇÃO, offset não pode ser um número negativo!' });
            return;
        }

        const filters = {} as FilterType;
        
        if(q) {
            filters.title = { '$regex': q, '$options': 'i' };
        }
        if(cat) {
            const c = await Category.findOne({ slug: cat }) as CategoryType;
            if(c) {
                filters.category = c._id.toString();
            }
        }
        if(state) {
            const s = await State.findOne({ name: state }) as StateType;
            if(s) {
                filters.state = s._id.toString();
            }
        }

        const adsTotal = await Ad.find(filters) as AdType[];
        total = adsTotal.length;

        const adsData = await Ad.find(filters)
            .sort({dateCreated: (sort === 'DESC' ? -1 : 1)})
            .skip(parseInt(offset as string))
            .limit(parseInt(limit as string)) as AdType[];
        
        let ads: AdsType[] = [];

        for(let i in adsData) {
            let image: string = '';
            const defaultImg = adsData[i].images.find(e => e.default);

            if(defaultImg) {
                image = `${defaultImg.url}`;
            }

            ads.push({
                _id: adsData[i] ._id,
                title: adsData[i]. title,
                price: adsData[i].price,
                priceNegotiable: adsData[i].priceNegotiable,
                image
            });
        }

        res.json({ ads, total });
    },
    getAd: async (req: Request, res: Response) => {
        const { id } = req.params;

        type OthersType = {
            _id: ObjectId;
            title: string;
            price: number;
            priceNegotiable: boolean;
            image: string;
        }

        if(!id) {
            res.json({ error: 'Sem código do produto!' });
            return;
        }

        let ads = {} as AdType;
        
        if(mongoose.Types.ObjectId.isValid(id as string)) {
            const adItem = await Ad.findById(id) as AdType;
            if(!adItem) {
                res.json({ error: 'Produto inexistente!' });
                return;
            } else {
                ads = adItem;
            }
        } else {
            res.json({ error: 'Código do produto está inválido!' });
            return;
        }

        await Ad.updateOne({ _id: ads._id }, { views: ads.views + 1 });

        let images: string[] = [];

        for(let i in ads.images) {
            images.push(`${ads.images[i].url}`);
        }

        const category = await Category.findById(ads.category) as CategoryType;
        const userInfo = await User.findById(ads.idUser) as UserType;
        const state = await State.findById(ads.state) as StateType;        

        const other = await Ad.find({ status: true, idUser: ads.idUser }) as AdType[];
        let others = [] as OthersType[];
        
        if(other.length > 1) {
            for(let i in other) {
                if(other[i]._id.toString() !== ads._id.toString()) {
                    let image: string = '';
                    const defaultImg = other[i].images.find(e => e.default);

                    if(defaultImg) {
                        image = `${defaultImg.url}`;
                    }
                    
                    others.push({
                        _id: other[i]._id,
                        title: other[i].title,
                        price: other[i].price,
                        priceNegotiable: other[i].priceNegotiable,
                        image
                    });
                }
            }
        }

        res.json({
            _id: ads._id,
            title: ads.title,
            price: ads.price,
            dateCreated: ads.dateCreated,
            priceNegotiable: ads.priceNegotiable,
            description: ads.description,
            views: ads.views,
            images,
            category,
            state,
            userInfo: {
                name: userInfo.name,
                email: userInfo.email
            },
            others
        });
    },
    editAd: async (req: Request, res: Response) => {
        const { id } = req.params;
        const files = req.files as Express.Multer.File[];
        const user = req.user as UserType;
        let { title, status, price, priceneg, desc, cat } = req.body;

        if(!id) {
            res.json({ error: 'Sem código do produto!' });
            return;
        }

        let ads = {} as AdType;
        
        if(mongoose.Types.ObjectId.isValid(id as string)) {
            const adItem = await Ad.findById(id) as AdType;
            if(!adItem) {
                res.json({ error: 'Produto inexistente!' });
                return;
            } else {
                ads = adItem;
            }
        } else {
            res.json({ error: 'Código do produto está inválido!' });
            return;
        }

        console.log(user._id.toString, ads.idUser.toString());
        if(user._id.toString() === ads.idUser.toString()) {
            let updates = {} as AdType;

            if(title) {
                updates.title = title;
            }
            if(status) {
                updates.state = status;
            }
            if(price === 'NaN' || price === NaN || price === '"NaN"') {
                res.json({ error: 'Preço não pode possuir o valor NaN!' });
                return;
            }
            if(price) {
                price = price.replace('.', '').replace(',', '').replace(' ', '').replace('R$', '');
                price = parseFloat(price);
                updates.price = price;
            }
            if(priceneg) {
                updates.priceNegotiable = (priceneg === 'true') ? true : false;
            }
            if(desc) {
                updates.description = desc;
            }
            if(cat) {
                const category = await Category.findOne({ slug: cat }) as CategoryType;
                if(!category) {
                    res.json({ error: 'Categoria inexistente' });
                    return;
                }
                updates.category = category._id.toString();
            }

            await Ad.findByIdAndUpdate( id, { $set: updates } );

            if(files) {
                const adI = await Ad.findById(id) as AdType;

                for(let i in files) {
                    const url: string = `midia/${v4()}.jpg`;
                    await sharp(files[i].path)
                        .resize(500, 500, { fit: 'contain' })
                        .toFormat('jpg')
                        .toFile(`./public/${url}`);                
                    
                    const newUrl = `${process.env.BASE}/${url}`;
                    adI.images.push({ url: newUrl, default: false });

                    await unlink(files[i].path);
                }

                await Ad.findOneAndUpdate({ _id: adI._id }, { images: adI.images });
            }

            res.json({ atualização: true });
        } else {
            res.json({ error: 'Somente o proprietário desde anúncio pode fazer edições!' });
            return;
        }
    },
    delAd: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as UserType;

        if(!id) {
            res.json({ error: 'Sem código do produto!' });
            return;
        }

        if(mongoose.Types.ObjectId.isValid(id as string)) {
            const adItem = await Ad.findById(id) as AdType;
            if(!adItem) {
                res.json({ error: 'Produto inexistente!' });
                return;
            } else {
                if(adItem.idUser.toString() === user._id.toString()) {
                    await Ad.findByIdAndDelete(id);
                    res.json({});
                } else {
                    res.json({ error: 'Somente o proprietário pode remover este anúncio!' });
                    return;
                }
            }
        } else {
            res.json({ error: 'Código do produto está inválido!' });
            return;
        }
    }
}