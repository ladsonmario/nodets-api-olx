import mongoose, { Query } from 'mongoose';
import dotenv from 'dotenv';
import sharp from 'sharp';

import { Request, Response } from 'express';
import { unlink } from 'fs/promises';

import { titleUpperCase } from '../services/AdsService';
import Category from '../models/Category';
import User, { UserType } from '../models/User';
import Ads from '../models/Ads';
import State from '../models/State';

dotenv.config();

export const getCategories = async (req: Request, res: Response) => {
    const cats = await Category.find();

    let category = [];

    for(let i in cats) {
        category.push({
            name: cats[i].name,
            slug: cats[i].slug,
            img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`
        });
    }

    res.json({ category });
}

export const addAction = async (req: Request, res: Response) => {
    let { title, price, priceneg, desc, cat } = req.body;
    
    const userReq = req.user as UserType;

    const user = await User.findOne({ email: userReq.email }) as any;

    if(!title || !cat) {
        res.json({ error: 'Inexistent title and/or category' });        
        return;
    }

    if(mongoose.Types.ObjectId.isValid(cat)) {
        const category = await Category.findById(cat);
        
        if(!category) {
            res.json({ error: 'Inexistent category' });
            return;
        }
        
    } else {
        res.json({ error: 'Inexistent category ID' });
        return;
    }

    if(price) {
        price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
        price = parseFloat(price);
    } else {
        price = 0;
    }

    const newAds: any = new Ads({
        status: true,
        idUser: user._id,
        state: user.state,
        dateCreated: new Date(),
        title,
        category: cat,
        price,
        priceNegotiable: (priceneg == 'true') ? true : false,
        description: desc,
        views: 0                        
    });    

    if(req.files) {
        const files = req.files as Express.Multer.File[];
        
        for(let i in files) {            

            await sharp(files[i].path)
                .resize(500, 500)
                .toFormat('jpg')
                .toFile(`./public/media/${files[i].path.substring(5)}`);

            let url = `${files[i].path.substring(5)}`;
           
            newAds.images.push({url, default: false});

            await unlink(files[i].path);
        }        
    }

    if(newAds.images.length > 0) {
        newAds.images[0].default = true;
    }

    const info = await newAds.save();

    res.json({ id: info._id });
}

export const getList = async (req: Request, res: Response) => {
    let { sort = 'ASC', offset = 0, limit = 8, q, cat, state } = req.query;
    let filters: any = { status: true };
    let total: number = 0;    

    if(q) {
        filters.title = { '$regex': q, '$options': 'i' };
    }

    if(cat) {
        const c = await Category.findOne({ slug: cat }) as any;        
        if(c) {
            filters.category = c._id.toString();
        }
    }

    if(state) {
        const s = await State.findOne({ name: titleUpperCase(state as string) }) as any;        
        if(s) {            
            filters.state = s._id.toString();
        }
    }    

    const adsTotal = await Ads.find(filters);
    total = adsTotal.length;

    const adsData = await Ads.find(filters)
        .sort({dateCreated: (sort == 'DESC' ? -1 : 1)})
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string)) as any;
    
    let ads: any = [];

    for(let i in adsData) {  
        let image: string = '';      
        let defaultImg = adsData[i].images.find((e: any) => e.default);        

        if(defaultImg) {
            image = `${process.env.BASE}/media/${defaultImg.url}`;
        } else {
            image = `${process.env.BASE}/media/default.img`;
        }

        ads.push({
            id: adsData._id,
            title: adsData[i].title,
            price: adsData[i].price,
            priceNegotiable: adsData[i].priceNegotiable,
            image
        });
    }

    res.json({ ads, total });
}

export const getItem = async (req: Request, res: Response) => {
    let { id, other = null } = req.query;

    if(!id) {
        res.json({ error: 'No product' });
        return;
    }

    let ads: any;

    if(mongoose.Types.ObjectId.isValid(id as string)) {
        const adsId = await Ads.findById(id);

        if(!adsId) {
            res.json({ error: 'Inexistent product' });
            return;
        } else {
            ads = adsId;
        }

    } else {
        res.json({ error: 'Invalid ID' });
        return;
    }

    ads.views++;
    await ads.save();

    let images: any = [];

    for(let i in ads.images) {
        images.push( `${process.env.BASE}/media/${ads.images[i].url}` );
    }

    let category = await Category.findById(ads.category);
    let userInfo = await User.findById(ads.idUser) as UserType;
    let stateInfo = await State.findById(ads.state);

    let others: any = [];

    if(other) {
        const otherData = await Ads.find({ status: true, idUser: ads.idUser });
        
        for(let i in otherData) {
            if(otherData[i]._id.toString() != ads._id.toString()) {
                
                let image = `${process.env.Base}/media/default.jpg`;
                let defaultImg = otherData[i].images.find((e: any) => e.default);

                if(defaultImg) {
                    image = `${process.env.BASE}/media/${defaultImg.url}`;
                }

                others.push({
                    id: otherData[i]._id,
                    title: otherData[i].title,
                    price: otherData[i].price,
                    priceNegotiable: otherData[i].priceNegotiable,
                    image
                });
            }
        }
    }
    
    res.json({
        id: ads._id,
        title: ads.title,
        price: ads.price,
        priceNegotiable: ads.priceNegotiable,
        description: ads.description,
        views: ads.views,
        images,
        category,
        userInfo: {
            name: userInfo.name,
            email: userInfo.email
        },
        stateName: stateInfo?.name,
        others
    });
}

export const editAction = async (req: Request, res: Response) => {
    let { id } = req.params;
    let { title, status, price, priceneg, desc, cat } = req.body;

    let ads: any;

    if(mongoose.Types.ObjectId.isValid(id as string)) {
        const adsId = await Ads.findById(id);

        if(!adsId) {
            res.json({ error: 'Inexistent ad' });
            return;
        } else {
            ads = adsId;
        }
    } else {
        res.json({ error: 'Invalid ID' });
        return;
    }

    let updates: any = {};

    if(title) {
        updates.title = title;
    }    
    if(status) {
        updates.status = status;
    }
    if(price) {
        price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
        price = parseFloat(price);
        updates.price = price;
    }
    if(priceneg) {
        updates.priceNegotiable = priceneg;
    }
    if(desc) {
        updates.description = desc;
    }
    if(cat) {
        const category = await Category.findOne({ slug: cat });
        
        if(!category) {
            res.json({ error: 'Inexistent category' });
            return;
        }

        updates.category = category._id.toString();
    }
    
    await Ads.findByIdAndUpdate(id, { $set: updates });

    if(req.files) {
        const files = req.files as Express.Multer.File[];
        const adI = await Ads.findById(id) as any;
        
        for(let i in files) {            

            await sharp(files[i].path)
                .resize(500, 500)
                .toFormat('jpg')
                .toFile(`./public/media/${files[i].path.substring(5)}`);

            let url = `${files[i].path.substring(5)}`;
           
            adI.images.push({url, default: false});

            await unlink(files[i].path);            
        } 

        adI.images = [...adI.images];
        await adI.save();
    } 
    
    res.json({ actualized: true });
}