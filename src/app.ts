import express from 'express';
import { logger } from './config/logger';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.routes';
import farmRoutes from "./routes/farm.routes";
import { notFound } from './middlewares/not-found';
import cropRoutes from './routes/crop.routes';
import weeklyLogsRoutes from './routes/weekly-log.routes';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.get('/', (req, res) => {
    logger.info('hello from logger');
    return res.status(200).json({ msg: 'hello from backend' });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Api is running!',
    });
});

app.use('/api/auth', authRoute);
app.use("/api/farms", farmRoutes);
app.use('/api/crops',cropRoutes);
app.use('/api/weekly-logs',weeklyLogsRoutes);




app.use(notFound)
export default app;
