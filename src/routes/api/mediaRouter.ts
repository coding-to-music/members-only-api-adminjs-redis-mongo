import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import mediaController from '@controllers/mediaController';

const mediaRouter: CustomIRouter = Router();

mediaRouter.post('/upload', mediaController.uploadMedia);

mediaRouter.get('/:filename', mediaController.getMediaFile);

mediaRouter.delete('/:filename/delete', mediaController.deleteMediaFile);

export default mediaRouter;