import 'dotenv/config';

import express from 'express';
import connectDB from './database/db.js';
import cors from 'cors';
import passport from './utils/passport.js';
import seedAdmin from './utils/seedAdmin.js';

import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(passport.initialize());

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/order', orderRoute);

app.listen(PORT, async () => {
    await connectDB();
    await seedAdmin();
    console.log(`Server running on port ${PORT}`);
});