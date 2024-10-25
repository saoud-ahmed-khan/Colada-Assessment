import { Schema, Document, model } from 'mongoose';

interface IOrder extends Document {
  user: string;
  date: Date;
  totalPrice: number;
  location: {
    type: string;
    coordinates: number[];
  };
  products: string[];
}

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
});

// Create a 2dsphere index on the location field
orderSchema.index({ location: '2dsphere' });

// Create the model
const Order = model<IOrder>('orders', orderSchema);

export default Order;
