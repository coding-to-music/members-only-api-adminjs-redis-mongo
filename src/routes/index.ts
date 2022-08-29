import { Router } from 'express';

const indexRouter = Router();

indexRouter.get('/', (req, res) => res.redirect('/v1'));

export default indexRouter;