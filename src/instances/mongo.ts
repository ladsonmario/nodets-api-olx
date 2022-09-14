import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const MongoConnect = async () => {
    try {
        console.log('Connecting database...');
        await connect(process.env.DATABASE as string);
        console.log('Database connected!');
    } catch(error) {
        console.log(error);
    }
}