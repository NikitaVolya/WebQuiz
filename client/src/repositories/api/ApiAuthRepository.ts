/**
 * @file repositories/api/ApiAuthRepository.ts
 * Implémentation réelle communiquant avec le Backend PHP avec Mapping
 */
import api from '../../api/axiosInstance';
import type { IAuthRepository } from '../IAuthRepository';
import type { User, UserCredentials, SignUpData } from '../../types/auth';
import { UserMapper } from './mappers/UserMapper';

export class ApiAuthRepository implements IAuthRepository {
  
  /**
   * Appelle /auth/login
   */
  async authenticate(credentials: UserCredentials): Promise<User | null> {
    try {
      const response = await api.post('/auth/login', credentials);

      const { user: rawUser, token } = response.data;

      if (token && rawUser) {
        const user = UserMapper.toDomain(rawUser);
        
        localStorage.setItem('auth_token', token);
        this.saveSession(user);
        return user;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
      return null;
    }
  }

  /**
   * Appelle /auth/register
   */
  async create(data: SignUpData): Promise<User> {
    const response = await api.post('/auth/register', data);
    return UserMapper.toDomain(response.data);
  }

  /**
   * Appelle /auth/exists
   */
  async exists(field: 'email' | 'username', value: string): Promise<boolean> {
    const response = await api.get('/auth/exists', {
      params: { field, value }
    });
    return response.data.exists;
  }

  /**
   * Appelle /users/:id
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const response = await api.get(`/users/${userId}`);
      return UserMapper.toDomain(response.data);
    } catch {
      return null;
    }
  }

  // --- PERSISTANCE LOCALE ---

  saveSession(user: User): void {
    localStorage.setItem('quiz_user_session', JSON.stringify(user));
  }

  loadSession(): User | null {
    const data = localStorage.getItem('quiz_user_session');
    return data ? JSON.parse(data) : null;
  }

  destroySession(): void {
    localStorage.removeItem('quiz_user_session');
    localStorage.removeItem('auth_token');
  }
}