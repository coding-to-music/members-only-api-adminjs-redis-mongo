import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { MediaController } from '@controllers/media.controller';
import { MediaRequestValidator } from '@middlewares/validations/media.validation';


export class MediaRouter {

    private router: CustomIRouter;
    private mediaController = new MediaController();
    private mediaRequestValidator = new MediaRequestValidator()

    constructor() {
        this.router = Router();
        this.mediaController = new MediaController();
        this.mediaRequestValidator = new MediaRequestValidator()
        this.registerRoutes();
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));

        this.router.post(
            '/upload',
            this.mediaController.uploadMedia
        );

        this.router.get(
            '/:filename',
            this.mediaRequestValidator.checkFileNameValidator,
            this.mediaController.getMediaFile
        );

        this.router.delete(
            '/:filename',
            this.mediaRequestValidator.checkFileNameValidator,
            this.mediaController.deleteMediaFile
        );
    }

    public getRoutes() {
        return this.router;
    }
}