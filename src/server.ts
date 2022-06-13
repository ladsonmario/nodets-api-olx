import express, { ErrorRequestHandler, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import { mongoConnect } from './instances/mongo';
import apiRoutes from './routes/routes';

dotenv.config();

mongoConnect();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.use('/', apiRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
server.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`Running Address: ${process.env.PORT}`);
});