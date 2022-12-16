import { Request, Response } from "express";
import { BaseRouter } from "@shared/routers/base.router";

export class IndexRouter extends BaseRouter {

    constructor() {
        super();

        this.registerRoutes();
    }

    private index(req: Request, res: Response) {
        res.json({
            message: `PLEASE VISIT '/api-docs' FOR FULL API DOCUMENTATION`
        })
    }

    protected registerRoutes() {
        this.router.get('/', this.index);
    }
}