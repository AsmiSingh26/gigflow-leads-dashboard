import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AuthRequest } from '../types';
const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'All fields required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Server error', error: String(error) });
}
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'All fields required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Server error', error: String(error) });
}
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as AuthRequest).user?.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Server error', error: String(error) });
}
};
