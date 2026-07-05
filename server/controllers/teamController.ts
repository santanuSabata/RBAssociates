import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = db.list('team');
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, designation, imageUrl, description, socialLinks } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ message: 'Name and designation are required.' });
    }

    const newMember = db.insert('team', {
      name,
      designation,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500',
      description: description || '',
      socialLinks: socialLinks || { facebook: '', linkedin: '', twitter: '' }
    });

    res.status(201).json({
      member: newMember,
      message: 'Team member added successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, designation, imageUrl, description, socialLinks } = req.body;

    const member = db.findById('team', id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found.' });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (designation !== undefined) updates.designation = designation;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;
    if (socialLinks !== undefined) updates.socialLinks = socialLinks;

    const updated = db.update('team', id, updates);
    res.json({
      member: updated,
      message: 'Team member updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('team', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Team member not found.' });
    }
    res.json({ message: 'Team member deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
