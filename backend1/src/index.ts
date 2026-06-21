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

app.use((req, res, next) => {
  console.log(`-> PRZYCHODZI: ${req.method} ${req.url}`);
  next();
});


app.use(cors({
  origin: ['http://149.156.194.192:8802', 'http://localhost:8802'], // Twój serwer IP oraz localhost
  credentials: true,                // Zezwolenie na ciasteczka/autoryzację
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Dozwolone metody
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // Dozwolone nagłówki
}));
const PORT = process.env.PORT || 8801;


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/institution', institutionRoutes);

app.use('/api/applications', applicationRoutes);


app.use('/api', healthRoutes);


app.get('/', (req, res) => {
  res.send('System rekrutacji EduEnroll działa pomyślnie!');
});

app.listen(parseInt(PORT as string), '0.0.0.0', () => {
  console.log(`Serwer backendowy EduEnroll wystartował na porcie ${PORT} i nasłuchuje na 0.0.0.0`);
});