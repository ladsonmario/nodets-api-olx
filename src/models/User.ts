import { Schema, model, Model, connection, ObjectId } from 'mongoose';

export type UserType = {
    _id: ObjectId;
    name: string;
    email: string;
    state: string;
    passwordHash: string;
    token: string;
    administrator?: boolean;
}

const schema = new Schema<UserType>({
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
    },
    administrator: {
        type: Boolean,
        required: true
    }
});

const modelName = 'User';

const UserModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <UserType>) :
    model <UserType> (modelName, schema);

export default UserModel;