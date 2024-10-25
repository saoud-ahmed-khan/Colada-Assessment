import { Schema, Document, model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  orders: string[]; // Array of Order IDs
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

// Create the model
const User = model<IUser>('users', userSchema);

export default User;
