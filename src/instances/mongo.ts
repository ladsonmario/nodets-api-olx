import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async () => {
    try {
        console.log('Connecting...');
        await connect(process.env.MONGO_URL as string);
        console.log('Connected!');
    } catch(error) {
        console.log(error);
    }
}