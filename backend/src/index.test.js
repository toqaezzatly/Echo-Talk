import request from 'supertest';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
));
app.use("/api/auth", authRoutes);
app.use('/api/message', messageRoutes);

describe('API Endpoints', () => {
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.statusCode).toEqual(404);
    });

    it('should handle auth routes', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'testpassword'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should handle message routes', async () => {
        const res = await request(app).get('/api/message');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});