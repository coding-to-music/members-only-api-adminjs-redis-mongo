import { IRouter } from "express";

export type CustomIRouter = IRouter & {
    get: (path: string, ...middlewares: any[]) => IRouter;
}

