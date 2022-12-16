import { Request } from "express";
import { IUser } from "@user/interfaces/users.interface";

export interface RequestWithUser extends Request {
    user: IUser;
}