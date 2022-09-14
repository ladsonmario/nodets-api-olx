import { Schema, model, Model, connection, ObjectId } from 'mongoose';

export type AdType = {
    _id: ObjectId;
    idUser: string;
    state: string;
    category: string;
    images: [{
        url: string;
        default: boolean;
    }];
    dateCreated: Date;
    title: string;
    price: number;
    priceNegotiable: boolean;
    description: string;
    views: number;
    status: string;
}

const schema = new Schema<AdType>({
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
    images: [{
        url: {
            type: String,
            required: true
        },
        default: {
            type: Boolean,
            required: true
        }
    }],
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

const modelName = 'Ad';

const AdModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <AdType>) :
    model <AdType> (modelName, schema);

export default AdModel;