import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Category, { CategoryType } from '../models/Category';
import { UserType } from '../models/User';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

export const CategoryController = {
    getCategories: async (req: Request, res: Response) => {
        const cats: CategoryType[] = await Category.find();

        let category: CategoryType[] = [];

        for(let i in cats) {
            category.push({ 
                _id: cats[i]._id,
                name: cats[i].name,
                slug: cats[i].slug,            
                img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`
            });
        }

        res.json({ category });
    },
    addCategory: async (req: Request, res: Response) => {
        const { name, slug } = req.body;
        const file = req.file as Express.Multer.File;
        
        if(name && slug && file) {
            const catsName = await Category.findOne({ name }) as CategoryType;
            const catsSlug = await Category.findOne({ slug }) as CategoryType;

            if(catsName) {
                res.json({ error: 'Já existe uma categoria com este nome!' });
                return;
            }
            if(catsSlug) {
                res.json({ error: 'Já existe um slug com este nome!' });
                return;
            }

            let url: string = '';
            if(!file) {
                res.json({ error: 'É necessário inserir um icone para sua categoria!' });
            } else {            
                await sharp(file.path)
                    .resize(46, 46, { fit: 'contain' })
                    .toFormat('png')
                    .toFile(`./public/assets/images/${slug}.png`)

                url = `${process.env.BASE}/assets/images/${slug}.png`;
                
                await unlink(file.path);
            }

            await Category.create({
                name,
                slug,
                img: url
            });

            res.json({ name, slug, img: url});
        } else {
            res.json({ error: 'É necessário enviar os campos [name, slug, img] preenchidos!' });
            return;
        }
    },
    delCategory: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as UserType;

        if(user.administrator) {
            if(mongoose.Types.ObjectId.isValid(id)) {
                const catItem = await Category.findById(id) as CategoryType;
                if(!catItem) {
                    res.json({ error: 'Categoria inexistente!' });
                    return;
                } else {
                    await Category.findByIdAndDelete(id);
                    res.json({});
                }
            } else {
                res.json({ error: 'Código da categoria está inválido!' });
                return;
            }
        } else {
            res.json({ error: 'Você não possui permissões para essa ação, entre em contado com um admistrador!' });
            return;
        }
    }
}