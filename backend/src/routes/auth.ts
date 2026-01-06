import { Router } from 'express';
import { prisma } from '../db.js';
import { AuthService } from '../services/authService.js';
import winston from 'winston';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth.log' })
  ]
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await AuthService.hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      }
    });

    logger.info(`New user registered: ${user.email} (${user.id})`);

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = AuthService.generateAccessToken(payload);
    const refreshToken = AuthService.generateRefreshToken(payload);

    await AuthService.saveRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken
    });
  } catch (error: any) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await AuthService.comparePassword(password, user.password))) {
      logger.warn(`Failed login attempt for email: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = AuthService.generateAccessToken(payload);
    const refreshToken = AuthService.generateRefreshToken(payload);

    await AuthService.saveRefreshToken(user.id, refreshToken);

    logger.info(`Successful login for user: ${user.email} (${user.id})`);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken
    });
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const payload = AuthService.verifyRefreshToken(refreshToken);
    const isValid = await AuthService.isRefreshTokenValid(refreshToken, payload.userId);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const newAccessToken = AuthService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });

    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      await AuthService.revokeRefreshToken(refreshToken);
    } catch (error) {
      // Ignore errors during logout
    }
  }

  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;
