import multer, { diskStorage } from 'multer';
import { v4 } from 'uuid';

export const UploadFiles = multer({         
    fileFilter:(req, file, cb) => {
        const images: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
        cb(null, images.includes(file.mimetype));        
    },
    storage: diskStorage({
        destination: './temp',
        filename: (req, file, cb) => {
            cb(null, `${v4()}.jpg`)
        }
    })
});