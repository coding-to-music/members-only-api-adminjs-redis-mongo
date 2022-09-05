import { Router } from 'express';
import authRouter from '@routes/api/authRouter';
import mediaRouter from '@routes/api/mediaRouter';
import messageRouter from '@routes/api/messageRouter';
import passwordRouter from '@routes/api/passwordRouter';
import postRouter from '@routes/api/postRouter';
import profileRouter from '@routes/api/profileRouter';
import userRouter from '@routes/api/userRouter';

const apiRouter: Router = Router();

apiRouter.get('/', (req, res) => res.json({
    message: `HELLO VISITOR, THANK YOU FOR STOPPING-BY AND WELCOME TO MEMBERS-ONLY API.
    PLEASE VISIT '/api-docs' FOR FULL API DOCUMENTATION`
}));

apiRouter.use('/auth', authRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/messages', messageRouter);
apiRouter.use('/password', passwordRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/users', userRouter);

export default apiRouter;