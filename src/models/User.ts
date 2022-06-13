import { Schema, model, Model, connection } from 'mongoose';

export type UserType = {
    name: string,
    email: string,
    state: string,
    passwordHash: string,
    token: string
}

export const schema = new Schema<UserType>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const modelName = 'User';

const UserModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <UserType>) :
    model <UserType> (modelName, schema);

export default UserModel;