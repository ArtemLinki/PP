import type { ID, ISODateString } from './common.dto';

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

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'B2C' | 'B2B';
}

export interface AuthTokenDto {
  accessToken: string;
  expiresAt: ISODateString;
}

export interface AuthSessionDto {
  user: UserDto;
  token: AuthTokenDto;
}
