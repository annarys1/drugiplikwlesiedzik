import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db'; // To automatycznie wywoła nasz test połączenia z bazą
import authRoutes from './routes/authRoutes';
import childrenRoutes from './routes/childrenRoutes';
import institutionRoutes from './routes/institutionRoutes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/institution', institutionRoutes);
app.post('/api/institution/test', (req, res) => {
  res.send('Testowa trasa instytucji działa!');
});
app.get('/', (req, res) => {
  res.send('System rekrutacji EduEnroll działa pomyślnie!');
});

app.listen(PORT, () => {
  console.log(`Serwer backendowy EduEnroll wystartował na porcie ${PORT}`);
});