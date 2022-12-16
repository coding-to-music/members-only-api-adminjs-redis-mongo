import { Document } from "mongoose";
import { ITokens, IValidate, IVerify } from "@auth/interfaces/auth.interface";

interface ResetPassword {
  code: string;
  expiresBy: Date;
}

interface RefreshToken {
  token: string;
  expiresBy: Date;
}

export interface TwoFactor {
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
  personalKey: string,
  resetPassword: ResetPassword;
  refreshToken: RefreshToken;
  tokenVersion: number;
  lastLogin?: Date;
  twoFactor: TwoFactor;
  generateCode: () => Promise<string>;
  generateTokens(usr: IUser): Promise<ITokens>;
  logout(): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
  validateRefreshToken(efreshToken: string, tokenVersion: number): Promise<IValidate>;
  verifyCode: (code: string) => Promise<IVerify>;
}