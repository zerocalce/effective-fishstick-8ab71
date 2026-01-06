import { AuthService } from '../services/authService.js';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  const payload = { userId: 'user-123', email: 'test@example.com', role: 'USER' };

  it('should generate a valid access token', () => {
    const token = AuthService.generateAccessToken(payload);
    expect(token).toBeDefined();
    
    const verified = AuthService.verifyAccessToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.email).toBe(payload.email);
  });

  it('should generate a valid refresh token', () => {
    const token = AuthService.generateRefreshToken(payload);
    expect(token).toBeDefined();
    
    const verified = AuthService.verifyRefreshToken(token);
    expect(verified.userId).toBe(payload.userId);
  });

  it('should throw error for expired token', () => {
    const expiredToken = jwt.sign(payload, process.env.JWT_SECRET || 'fallback', { expiresIn: '0s' });
    expect(() => AuthService.verifyAccessToken(expiredToken)).toThrow();
  });

  it('should hash and compare passwords correctly', async () => {
    const password = 'securePassword123';
    const hash = await AuthService.hashPassword(password);
    expect(hash).not.toBe(password);
    
    const isMatch = await AuthService.comparePassword(password, hash);
    expect(isMatch).toBe(true);
    
    const isNotMatch = await AuthService.comparePassword('wrongPassword', hash);
    expect(isNotMatch).toBe(false);
  });
});
