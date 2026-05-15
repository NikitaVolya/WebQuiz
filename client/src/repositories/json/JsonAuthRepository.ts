/**
 * @file repositories/json/JsonAuthRepository.ts
 * Implémentation locale (localStorage) du contrat d'authentification.
 * Ce fichier sera remplacé par ApiAuthRepository lors du passage au PHP.
 */
import { db } from '../../infra/localStorageDB';
import type { IAuthRepository } from '../IAuthRepository';
import type { User, UserCredentials, SignUpData } from '../../types/auth';

const USERS_KEY = 'users';
const SESSION_KEY = 'current_session';

export const JsonAuthRepository: IAuthRepository = {
  
  async authenticate(credentials: UserCredentials): Promise<User | null> {
    // simule la latence du réseau (800ms)
    await new Promise(res => setTimeout(res, 800));
    
    const users = db.get<User>(USERS_KEY);
    const user = users.find(u => u.email === credentials.email);

    if (user && credentials.password === "1234") {
      return user;
    }
    return null;
  },

  async create(data: SignUpData): Promise<User> {
    await new Promise(res => setTimeout(res, 1000));
    
    const users = db.get<User>(USERS_KEY);
    
    const newUser: User = {
      id: Number(Math.random().toString(36).substr(2, 9)),
      username: data.username,
      email: data.email,
      createdAt: new Date().toISOString(),
      role: 'USER',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`
    };

    users.push(newUser);
    db.save(USERS_KEY, users);
    
    return newUser;
  },

  async exists(field: 'email' | 'username', value: string): Promise<boolean> {
    const users = db.get<User>(USERS_KEY);
    return users.some(u => u[field].toLowerCase() === value.toLowerCase());
  },

  async getUserById(userId: number): Promise<User | null> {
    const users = db.get<User>(USERS_KEY);
    return users.find(u => u.id === userId) || null;
  },

  saveSession(user: User): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  loadSession(): User | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  destroySession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
};