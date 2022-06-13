import { Schema, model, Model, connection } from 'mongoose';

export type AdsType = {
    idUser: string,
    state: string,
    category: string,
    images: any[],
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: string
}

export const schema = new Schema<AdsType>({
    idUser: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: [],    
    dateCreated: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    priceNegotiable: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const modelName = 'Ads';

const AdsModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <AdsType>) :
    model <AdsType> (modelName, schema);

export default AdsModel;