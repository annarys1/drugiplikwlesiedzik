import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Wszystkie pola są wymagane!' });
      return;
    }

    const [existingUsers]: any = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      res.status(400).json({ message: 'Użytkownik o tym adresie e-mail już istnieje!' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    await db.query(
      'INSERT INTO user (email, password, name, surname, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, 'parents']
    );

    res.status(201).json({ message: 'Rejestracja zakończona sukcesem!' });
  } catch (error: any) {
    console.error('Błąd rejestracji:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas rejestracji.' });
  }
};
export const registerHeadmaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Wszystkie pola są wymagane!' });
      return;
    }

    const [existingUsers]: any = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      res.status(400).json({ message: 'Użytkownik o tym adresie e-mail już istnieje!' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    await db.query(
      'INSERT INTO user (email, password, name, surname, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, 'headmaster']
    );

    res.status(201).json({ message: 'Konto dyrektora zostało utworzone!' });
  } catch (error: any) {
    console.error('Błąd rejestracji dyrektora:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas rejestracji dyrektora.' });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email i hasło są wymagane!' });
      return;
    }

    const [users]: any = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length === 0) {
      res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło!' });
      return;
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło!' });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'super_tajny_klucz_rezerwowy';
    const token = jwt.sign(
      { id: user.id_user, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Logowanie zakończona sukcesem!',
      token,
      user: {
        id: user.id_user,
        email: user.email,
        firstName: user.name,
        lastName: user.surname,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Błąd logowania:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas logowania.' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id; 

    const [users]: any = await db.query(
      'SELECT id_user, email, name, surname, role FROM user WHERE id_user = ?', 
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({ message: 'Użytkownik nie znaleziony.' });
      return;
    }

    res.status(200).json(users[0]);
  } catch (error: any) {
    console.error('Błąd pobierania profilu:', error.message);
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};