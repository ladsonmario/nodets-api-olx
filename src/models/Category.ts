import { Schema, model, Model, connection, ObjectId } from 'mongoose';

export type CategoryType = {
    _id: ObjectId;
    name: string;
    slug: string;
    img: string;
}

const schema = new Schema<CategoryType>({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true 
    }
});

const modelName = 'Category';

const CategoryModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <CategoryType>) :
    model <CategoryType> (modelName, schema);

export default CategoryModel;