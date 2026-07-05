import { Request, Response, NextFunction } from 'express';
import { db } from '../db/json-db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getJourney = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journey = db.list('journey');
    // Sort milestones by year ascending or descending (ascending is better for timelines)
    journey.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearA - yearB;
    });
    res.json(journey);
  } catch (error) {
    next(error);
  }
};

export const addJourneyMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { year, title, description, iconName } = req.body;

    if (!year || !title || !description) {
      return res.status(400).json({ message: 'Year, title, and description are required.' });
    }

    const newMilestone = db.insert('journey', {
      year,
      title,
      description,
      iconName: iconName || 'Building2'
    });

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Add Journey Milestone', `Added milestone: "${year} - ${title}"`, userLabel);

    res.status(201).json({
      milestone: newMilestone,
      message: 'Journey milestone added successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const updateJourneyMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { year, title, description, iconName } = req.body;

    const milestone = db.findById('journey', id);
    if (!milestone) {
      return res.status(404).json({ message: 'Journey milestone not found.' });
    }

    const updates: any = {};
    if (year !== undefined) updates.year = year;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (iconName !== undefined) updates.iconName = iconName;

    const updated = db.update('journey', id, updates);

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    db.log('Update Journey Milestone', `Updated milestone ID: ${id} (${year || milestone.year} - ${title || milestone.title})`, userLabel);

    res.json({
      milestone: updated,
      message: 'Journey milestone updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJourneyMilestone = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const milestone = db.findById('journey', id);
    const deleted = db.delete('journey', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Journey milestone not found.' });
    }

    // Log the change
    const userLabel = req.user ? `${req.user.fullName} (${req.user.username})` : 'Administrator';
    const milestoneLabel = milestone ? `${milestone.year} - ${milestone.title}` : id;
    db.log('Delete Journey Milestone', `Deleted milestone: "${milestoneLabel}"`, userLabel);

    res.json({ message: 'Journey milestone deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
