import { v4 as uuidv4 } from 'uuid';
import { storage } from '../storage';

export class AuthService {
  // Generate a fake token for a user
  generateToken(userId: string): string {
    const token = `fake_${uuidv4()}`;
    storage.saveToken(token, userId);
    return token;
  }

  // Validate token and return userId
  validateToken(token: string): string | null {
    const userId = storage.getUserIdByToken(token);
    return userId || null;
  }
}

export const authService = new AuthService();

