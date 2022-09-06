import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { MediaController } from '@controllers/media.controller';


export class MediaRouter {

    private mediaController = new MediaController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes();
    }

    private registerRoutes() {

        this.router.post('/upload', passport.authenticate('jwt', { session: false }), this.mediaController.uploadMedia);
        this.router.get('/:filename', passport.authenticate('jwt', { session: false }), this.mediaController.getMediaFile);
        this.router.delete('/:filename/delete', passport.authenticate('jwt', { session: false }), this.mediaController.deleteMediaFile);
    }

    public getRoutes() {
        return this.router;
    }
}