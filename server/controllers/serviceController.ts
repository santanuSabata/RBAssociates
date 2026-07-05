import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = db.list('services');
    res.json(services);
  } catch (error) {
    next(error);
  }
};

export const addService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, benefits, iconName, imageUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newService = db.insert('services', {
      title,
      description,
      iconName: iconName || 'FileText',
      benefits: Array.isArray(benefits) ? benefits : [],
      imageUrl: imageUrl || ''
    });

    res.status(201).json({
      service: newService,
      message: 'Service added successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, benefits, iconName, imageUrl } = req.body;

    const service = db.findById('services', id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (iconName !== undefined) updates.iconName = iconName;
    if (benefits !== undefined) updates.benefits = Array.isArray(benefits) ? benefits : [];
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const updated = db.update('services', id, updates);
    res.json({
      service: updated,
      message: 'Service updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('services', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    res.json({ message: 'Service deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
