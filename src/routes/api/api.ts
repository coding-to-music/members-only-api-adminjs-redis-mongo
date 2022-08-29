import { Router } from 'express';
import authRouter from '@src/routes/api/authRouter';
import mediaRouter from '@src/routes/api/mediaRouter';
import messageRouter from '@src/routes/api/messageRouter';
import passwordRouter from '@src/routes/api/passwordRouter';
import postRouter from '@routes/api/postRouter';
import profileRouter from '@src/routes/api/profileRouter';
import userRouter from '@src/routes/api/userRouter';

const apiRouter: Router = Router();

apiRouter.get('/', (req, res) => res.json({
    message: 'HELLO VISITOR, THANK YOU FOR STOPPING-BY AND WELCOME TO MEMBERS-ONLY API',
    documentation: `Please visit '/api-docs' for API Documentation`
}));

apiRouter.use('/auth', authRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/messaging', messageRouter);
apiRouter.use('/password', passwordRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/users', userRouter);

export default apiRouter;