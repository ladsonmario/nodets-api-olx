import { Schema, model, Model, connection, ObjectId } from 'mongoose';

export type StateType = {
    _id: ObjectId;
    name: string;
}

const schema = new Schema<StateType>({
    name: {
        type: String,
        required: true
    }
});

const modelName = 'State';

const StateModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <StateType>) :
    model <StateType> (modelName, schema);

export default StateModel;