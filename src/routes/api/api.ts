import { Router } from 'express';
import authRouter from '@routes/api/AuthRouter';
import userRouter from '@routes/api/UserRouter';
import passwordRouter from '@routes/api/PasswordRouter';
import postRouter from '@routes/api/PostRouter';
import profileRouter from '@routes/api/ProfileRouter';

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO MEMBERS-ONLY API' }) });

router.use('/auth', authRouter);
router.use('/password', passwordRouter);
router.use('/posts', postRouter);
router.use('/profile', profileRouter);
router.use('/users', userRouter);

export default router;