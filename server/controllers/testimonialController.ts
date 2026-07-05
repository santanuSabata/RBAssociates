import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = db.list('testimonials');
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

export const addTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientName, companyName, review, rating, imageUrl } = req.body;

    if (!clientName || !review) {
      return res.status(400).json({ message: 'Client name and review text are required.' });
    }

    const newTestimonial = db.insert('testimonials', {
      clientName,
      companyName: companyName || '',
      review,
      rating: rating ? parseInt(rating, 10) : 5,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    });

    res.status(201).json({
      testimonial: newTestimonial,
      message: 'Testimonial added successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { clientName, companyName, review, rating, imageUrl } = req.body;

    const testimonial = db.findById('testimonials', id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    const updates: any = {};
    if (clientName !== undefined) updates.clientName = clientName;
    if (companyName !== undefined) updates.companyName = companyName;
    if (review !== undefined) updates.review = review;
    if (rating !== undefined) updates.rating = parseInt(rating, 10);
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const updated = db.update('testimonials', id, updates);
    res.json({
      testimonial: updated,
      message: 'Testimonial updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('testimonials', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    res.json({ message: 'Testimonial deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
