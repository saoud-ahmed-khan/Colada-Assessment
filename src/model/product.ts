import { Schema, Document, model } from 'mongoose';

interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
}

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }
});

// Create the model
const Product = model<IProduct>('products', productSchema);

export default Product;
