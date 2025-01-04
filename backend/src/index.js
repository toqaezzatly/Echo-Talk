import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import connectDB from './lib/db.js';
import cors from 'cors';

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true
  }
));

app.use("/api/auth", authRoutes);
app.use('/api/message', messageRoutes); // Corrected this line

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    connectDB();
});
