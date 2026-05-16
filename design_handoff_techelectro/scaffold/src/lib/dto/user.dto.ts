import type { ID, ISODateString } from "./common.dto";

export type UserRole = "guest" | "customer" | "admin";

export interface UserDto {
  id: ID;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: ISODateString;
}

export interface AuthCredentialsDto {
  email: string;
  password: string;
}

export interface AuthTokenDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: ISODateString;
}

export interface AuthSessionDto {
  user: UserDto;
  token: AuthTokenDto;
}
