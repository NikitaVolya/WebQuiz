import { type User } from './User';

export type SignUpData = Pick<User, 'username' | 'email'> & {
  password: string;
};