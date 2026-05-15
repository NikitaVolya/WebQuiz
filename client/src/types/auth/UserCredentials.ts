import { type User } from './User';

export type UserCredentials = Pick<User, 'email'> & {
  password: string;
};