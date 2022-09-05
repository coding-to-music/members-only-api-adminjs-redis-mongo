import { Router } from 'express';
import authRouter from '@src/routes/api/auth.route';
import mediaRouter from '@src/routes/api/media.route';
import messageRouter from '@src/routes/api/message.route';
import passwordRouter from '@src/routes/api/password.route';
import postRouter from '@src/routes/api/post.route';
import profileRouter from '@src/routes/api/profile.route';
import userRouter from '@src/routes/api/user.route';

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