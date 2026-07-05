import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = db.list('users');
    // Sanitize passwords out of the response
    const sanitized = users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
    res.json(sanitized);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, password, email, fullName, role } = req.body;

    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ message: 'All fields (username, password, email, fullName) are required.' });
    }

    const users = db.list('users');
    const exists = users.find(u => u.username === username || u.email === email);
    if (exists) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = db.insert('users', {
      username,
      email,
      fullName,
      password: hashedPassword,
      role: role || 'Editor'
    });

    const { password: _, ...sanitizedUser } = newUser;
    res.status(201).json({
      user: sanitizedUser,
      message: 'User created successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { username, password, email, fullName, role } = req.body;

    const user = db.findById('users', id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updates: any = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (fullName) updates.fullName = fullName;
    if (role) updates.role = role;

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = db.update('users', id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Error updating user.' });
    }

    const { password: _, ...sanitizedUser } = updatedUser;
    res.json({
      user: sanitizedUser,
      message: 'User updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (req.user?.userId === id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    // Prevent deleting primary seed admin
    if (id === 'admin-user') {
      return res.status(400).json({ message: 'The primary system administrator cannot be deleted.' });
    }

    const deleted = db.delete('users', id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
