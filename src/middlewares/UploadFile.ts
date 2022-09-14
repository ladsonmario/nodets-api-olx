import multer, { diskStorage } from 'multer';
import { v4 } from 'uuid';

export const UploadFiles = multer({
    fileFilter: (req, file, cb) => {
        const images: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
        const verif: boolean = images.some(e => e === file.mimetype);        
        
        if(verif) {
            cb(null, true);            
        } else {
            return cb(new Error('Só aceitamos [jpg, jpge, png] como extensão de imagem!'));                
        }
    },
    storage: diskStorage({
        destination: './temp',
        filename: (req, file, cb) => {
            cb(null, `${v4()}.jpg`);
        }
    })
});