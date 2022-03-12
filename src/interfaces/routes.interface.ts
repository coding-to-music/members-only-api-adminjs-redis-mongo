import { IRouter } from "express";

export type CustomIRouter = IRouter & {
    get: (path: string, ...middlewares: any[]) => IRouter;
    post: (path: string, ...middlewares: any[]) => IRouter;
    put: (path: string, ...middlewares: any[]) => IRouter;
    delete: (path: string, ...middlewares: any[]) => IRouter;
}

