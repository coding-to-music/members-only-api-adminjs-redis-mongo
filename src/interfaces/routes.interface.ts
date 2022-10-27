import { IRouter } from 'express';

export type CustomIRouter = IRouter & {
    get: (path: string, ...middlewares: any[]) => IRouter;
    patch: (path: string, ...middlewares: any[]) => IRouter;
    post: (path: string, ...middlewares: any[]) => IRouter;
    put: (path: string, ...middlewares: any[]) => IRouter;
    delete: (path: string, ...middlewares: any[]) => IRouter;
    use: (...middlewares: any[]) => IRouter
}

