import { type User } from '../../../types/auth/User';

export class UserMapper {
  static toDomain(raw: any): User {
    if (!raw) return {} as User;
    
    return {
      id: Number(raw.id),
      username: raw.username || '',
      email: raw.email || '',
      avatarUrl: raw.avatar_url || '',
      role: raw.role || 'USER',
      createdAt: raw.created_at || new Date().toISOString()
    };
  }
}