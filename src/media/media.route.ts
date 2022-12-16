import passport from "passport";
import { BaseRouter } from "@shared/routers/base.router";
import { MediaController } from "./media.controller";
import { MediaRequestValidator } from "./middlewares/media.validation";


export class MediaRouter extends BaseRouter {

    private mediaController = new MediaController();
    private mediaRequestValidator = new MediaRequestValidator()

    constructor() {
        super()

        this.mediaController = new MediaController();
        this.mediaRequestValidator = new MediaRequestValidator()
        this.registerRoutes();
    }

    protected registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));

        this.router.post(
            '/upload',
            this.mediaController.uploadMedia
        );

        this.router.get(
            '/:filename',
            this.mediaRequestValidator.fileNameValidator,
            this.mediaController.getMediaFile
        );

        this.router.delete(
            '/:filename',
            this.mediaRequestValidator.fileNameValidator,
            this.mediaController.deleteMediaFile
        );
    }

}