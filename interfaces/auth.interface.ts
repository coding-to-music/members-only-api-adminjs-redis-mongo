export interface ITokens {
    token: string;
    refresh_token: string;
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