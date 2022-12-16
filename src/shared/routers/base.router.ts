import { Router } from "express";
import { CustomIRouter } from "../interfaces/router.interface";

export abstract class BaseRouter {

    protected readonly router: CustomIRouter;

    constructor() {
        this.router = Router();
    }

    protected abstract registerRoutes(): void

    public getRoutes() {
        return this.router;
    }
}