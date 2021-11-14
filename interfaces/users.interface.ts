import { Request } from 'express';

interface ResetPassword {
  code: string;
  expiresBy: Date;
}

interface RefreshToken {
  token: string;
  expiresBy: Date;
}

export interface IUser {
  _doc?: any;
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  isMember: boolean;
  resetPassword: ResetPassword;
  refreshToken: RefreshToken;
  lastLogin?: Date;
}

export interface RequestWithUser extends Request {
  user: IUser;
}