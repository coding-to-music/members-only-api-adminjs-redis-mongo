export interface ITokens {
    accessToken: string;
    refreshToken: string;
};

export interface IValidate {
    validToken: boolean;
    refreshTokenNotExpired: boolean;
    tokenVersionValid: boolean;
}

export interface IVerify {
    validCode: Promise<boolean>;
    codeNotExpired: boolean;
};