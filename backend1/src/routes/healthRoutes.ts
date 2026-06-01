import express from 'express';
import pool from '../config/db';

const router = express.Router();

router.get('/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'OK',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected'
    });
  }
});

export default router;