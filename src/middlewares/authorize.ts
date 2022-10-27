import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import { decode } from 'jsonwebtoken';
import { Role } from '@interfaces/users.interface';
import { ForbiddenException, NotFoundException } from '@exceptions/common.exception';


export class Authorize {

    public static admin(req: RequestWithUser, res: Response, next: NextFunction): void | Response {
        try {
            const { roles } = req.user;

            if (roles.indexOf(Role.ADMIN) === -1) {
                throw new ForbiddenException('User not authorized to access this resource');
            }

            next();

        } catch (err) {
            next(err)
        };
    };

    public static jwt(req: Request, res: Response, next: NextFunction): void | Response {
        try {
            
            const authHeader = req.headers['authorization'];
            
            const token = (authHeader && authHeader.startsWith('Bearer')) && authHeader.split(' ')[1];
            
            if (!token) {
                throw new NotFoundException('No token provided');
            }
            
            const decoded: any = decode(token);
            
            if (decoded.roles.indexOf(Role.ADMIN) === -1) {
                throw new ForbiddenException('User not authorized to access this resource');
            }
            
            next();

        } catch (err) {
            next(err)
        };
    };
}