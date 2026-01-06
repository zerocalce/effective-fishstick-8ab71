import type { Request, Response, NextFunction } from 'express';
import { AuthService, type TokenPayload } from '../services/authService.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth.log' })
  ]
});

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Missing or invalid authorization header from ${req.ip}`);
    return res.status(401).json({ error: 'Missing or invalid authentication token' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn(`Missing token in authorization header from ${req.ip}`);
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  try {
    const payload = AuthService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      logger.info(`Expired token attempt from ${req.ip}`);
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    logger.error(`Invalid token attempt from ${req.ip}: ${error.message}`);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user?.email || 'unknown'} to ${req.originalUrl}`);
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
