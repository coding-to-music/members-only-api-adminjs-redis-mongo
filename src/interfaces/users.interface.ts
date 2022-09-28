import { Request } from 'express';
import { Document } from 'mongoose';
import { ITokens, IValidate, IVerify } from '@src/interfaces/auth.interface';

interface ResetPassword {
  code: string;
  expiresBy: Date;
}

interface RefreshToken {
  token: string;
  expiresBy: Date;
}

interface twoFactor {
  base32Secret: string,
  enabled: boolean,
  passwordValidated: boolean
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
  RESTRICTED = 'RESTRICTED'
}

export interface IUser extends Document {
  _doc?: any;
  name: string;
  email: string;
  password: string;
  avatar: string;
  roles: Role[];
  resetPassword: ResetPassword;
  refreshToken: RefreshToken;
  tokenVersion: number;
  lastLogin?: Date;
  twoFactor: twoFactor;
  generateCode: () => Promise<string>;
  generateTokens(usr: IUser): Promise<ITokens>;
  validatePassword(password: string): Promise<boolean>;
  validateRefreshToken(efreshToken: string, tokenVersion: number): Promise<IValidate>;
  verifyCode: (code: string) => Promise<IVerify>;
}

export interface RequestWithUser extends Request {
  user: IUser;
}