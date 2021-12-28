import { Request } from 'express';
import { Document } from 'mongoose';
import { ITokens, IValidate, IVerify } from '@interfaces/auth.interface';

interface ResetPassword {
  code: string;
  expiresBy: Date;
}

interface RefreshToken {
  token: string;
  expiresBy: Date;
}

export interface IUser extends Document {
  _doc?: any;
  name: string;
  email: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  isMember: boolean;
  resetPassword: ResetPassword;
  refreshToken: RefreshToken;
  lastLogin?: Date;
  generateCode: () => Promise<string>;
  generateTokens(usr: IUser): Promise<ITokens>;
  validateRefreshToken(req: Request): Promise<IValidate>;
  verifyCode: (code: string) => Promise<IVerify>;
}

export interface RequestWithUser extends Request {
  user: IUser;
}