import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes/routes';
import { MongoConnect } from './instances/mongo';

dotenv.config();
MongoConnect();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.use(router);

const handleError: ErrorRequestHandler = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status);
    } else {
        res.status(400);
    }

    if(err.message) {
        res.json({ error: err.message });
    } else {
        res.json({ error: 'Ocorred error' });
    }
}

server.use(handleError);

server.listen(process.env.PORT, () => {
    console.log(`Running address: ${process.env.BASE}`);           
});