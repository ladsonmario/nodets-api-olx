import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sharp from 'sharp';

import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { unlink } from 'fs/promises';

import Category from '../models/Category';
import User, { UserType } from '../models/User';
import Ads from '../models/Ads';

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
    
}

export const getItem = async (req: Request, res: Response) => {

}

export const editAction = async (req: Request, res: Response) => {

}