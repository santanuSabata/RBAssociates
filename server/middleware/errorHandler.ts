import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Express Error Handler:', err);
  
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected server error occurred.';
  
  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
