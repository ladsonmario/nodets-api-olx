import { Schema, model, Model, connection } from 'mongoose';

export type CategoryType = {
    name: string,
    slug: string    
}

export const schema = new Schema<CategoryType>({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});

const modelName = 'Category';

const CategoryModel = connection && connection.models[modelName] ?
    (connection.models[modelName] as Model <CategoryType>) :
    model <CategoryType> (modelName, schema);

export default CategoryModel;