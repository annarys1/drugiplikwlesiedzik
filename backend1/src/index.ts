import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db'; 
import authRoutes from './routes/authRoutes';
import childrenRoutes from './routes/childrenRoutes';
import institutionRoutes from './routes/institutionRoutes';
import applicationRoutes from './routes/applicationRoutes';
import healthRoutes from './routes/healthRoutes';


dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // frontend
  credentials: true
}));
const PORT = process.env.PORT || 8801;


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/applications', applicationRoutes);


app.use('/api', healthRoutes);


app.get('/', (req, res) => {
  res.send('System rekrutacji EduEnroll działa pomyślnie!');
});

app.listen(parseInt(PORT as string), '0.0.0.0', () => {
  console.log(`Serwer backendowy EduEnroll wystartował na porcie ${PORT} i nasłuchuje na 0.0.0.0`);
});


