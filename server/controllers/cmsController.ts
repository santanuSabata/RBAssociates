import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getCMSContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cms = db.getSingle('cms');
    res.json(cms);
  } catch (error) {
    next(error);
  }
};

export const updateCMSContent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updated = db.updateSingle('cms', req.body);

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    const changedKeys = Object.keys(req.body).join(', ');
    db.log(
      'Update CMS Content',
      `Modified keys: ${changedKeys.length > 80 ? changedKeys.substring(0, 80) + '...' : changedKeys}`,
      userLabel
    );

    res.json({
      cms: updated,
      message: 'CMS Content updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const getFAQs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faqs = db.list('faqs');
    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

export const createFAQ = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const newFaq = db.insert('faqs', req.body);
    
    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Create FAQ', `Added FAQ: "${req.body.question}"`, userLabel);

    res.status(201).json({
      faq: newFaq,
      message: 'FAQ created successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = db.update('faqs', id, req.body);
    
    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Update FAQ', `Updated FAQ ID: ${id}`, userLabel);

    res.json({
      faq: updated,
      message: 'FAQ updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const faq = db.findById('faqs', id);
    const questionText = faq ? faq.question : id;
    db.delete('faqs', id);
    
    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Delete FAQ', `Deleted FAQ: "${questionText}"`, userLabel);

    res.json({
      message: 'FAQ deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};
