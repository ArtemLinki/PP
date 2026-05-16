import { ID, ISODateString } from './common.dto';

export type UserRole = 'B2C' | 'B2B' | 'ADMIN';

export interface UserDto {
  id: ID;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: ISODateString;
}

export interface AuthCredentialsDto {
  email: string;
  password: string;
}

export interface AuthSessionDto {
  accessToken: string;
  user: UserDto;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'B2C' | 'B2B';
}
