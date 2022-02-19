import { Router } from 'express';
import authRouter from '@routes/api/authRouter';
import userRouter from '@routes/api/userRouter';
import passwordRouter from '@routes/api/passwordRouter';
import postRouter from '@routes/api/postRouter';
import profileRouter from '@routes/api/profileRouter';

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO MEMBERS-ONLY API' }) });

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/password', passwordRouter);
router.use('/profile', profileRouter);
router.use('/post', postRouter);

export default router;