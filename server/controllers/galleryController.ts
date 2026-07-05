import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gallery = db.list('gallery');
    res.json(gallery);
  } catch (error) {
    next(error);
  }
};

export const addGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, category, imageUrl, description } = req.body;

    if (!imageUrl || !category) {
      return res.status(400).json({ message: 'Category and image link are required.' });
    }

    const newItem = db.insert('gallery', {
      title: title || 'Gallery Image',
      category,
      imageUrl,
      description: description || ''
    });

    res.status(201).json({
      item: newItem,
      message: 'Gallery image uploaded successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, category, imageUrl, description } = req.body;

    const item = db.findById('gallery', id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;

    const updated = db.update('gallery', id, updates);
    res.json({
      item: updated,
      message: 'Gallery item updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('gallery', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }
    res.json({ message: 'Gallery item deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
