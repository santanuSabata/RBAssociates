import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = db.getSingle('settings');
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = db.updateSingle('settings', req.body);
    
    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    const changedKeys = Object.keys(req.body).join(', ');
    db.log(
      'Update Settings',
      `Modified keys: ${changedKeys.length > 80 ? changedKeys.substring(0, 80) + '...' : changedKeys}`,
      userLabel
    );

    res.json({
      settings: updated,
      message: 'General Settings updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};
