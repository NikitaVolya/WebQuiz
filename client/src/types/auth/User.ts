import {type UserRole} from './UserRole';

export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  createdAt: string;
}