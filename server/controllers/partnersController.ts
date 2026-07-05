import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partners = db.list('partners');
    res.json(partners);
  } catch (error) {
    next(error);
  }
};

export const addPartner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, logoUrl, websiteUrl } = req.body;

    if (!name || !logoUrl) {
      return res.status(400).json({ message: 'Partner name and logo URL are required.' });
    }

    const newPartner = db.insert('partners', {
      name,
      logoUrl,
      websiteUrl: websiteUrl || ''
    });

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Add Partner Logo', `Added trusted partner: "${name}"`, userLabel);

    res.status(201).json({
      partner: newPartner,
      message: 'Trusted partner added successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updatePartner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, websiteUrl } = req.body;

    const partner = db.findById('partners', id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (logoUrl !== undefined) updates.logoUrl = logoUrl;
    if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;

    const updated = db.update('partners', id, updates);

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Update Partner Logo', `Updated trusted partner: "${name || partner.name}"`, userLabel);

    res.json({
      partner: updated,
      message: 'Trusted partner updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePartner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const partner = db.findById('partners', id);
    const deleted = db.delete('partners', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    const partnerName = partner ? partner.name : id;
    db.log('Delete Partner Logo', `Deleted trusted partner: "${partnerName}"`, userLabel);

    res.json({ message: 'Trusted partner deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
