import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Ładowanie zmiennych z pliku .env
dotenv.config();

// Utworzenie puli połączeń
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME, // Upewnij się, że tak samo nazywa się w .env!
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Funkcja testująca połączenie
async function testConnection() {
  try {
    // MySQL używa NOW() do sprawdzenia czasu
    const [rows]: any = await pool.query('SELECT NOW() as time, VERSION() as version');
    console.log('✅ Połączono z bazą danych MySQL/MariaDB!');
    console.log('Czas bazy:', rows[0].time);
    console.log('Wersja bazy:', rows[0].version);
  } catch (error: any) {
    console.error('❌ Błąd połączenia z bazą Apache:', error.message);
  }
  
}


testConnection();

export default pool;