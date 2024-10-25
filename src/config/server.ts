import express from 'express';
import cors from 'cors';
import connectDB from './db';
import userRoutes from '../routes/userRoute';
import productRoutes from '../routes/productRoute';
const app = express();

app.use(cors());
app.use(express.json());

// Routes


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
