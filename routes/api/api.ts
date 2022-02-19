import { Router } from 'express';
import authRouter from '@routes/api/authRouter';
import userRouter from '@routes/api/userRouter';
import passwordRouter from '@routes/api/passwordRouter';
import postRouter from '@routes/api/postRouter';
import profileRouter from '@routes/api/profileRouter';

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO MEMBERS-ONLY API' }) });

router.use('/auth', authRouter);
router.use('/password', passwordRouter);
router.use('/post', postRouter);
router.use('/profile', profileRouter);
router.use('/user', userRouter);

export default router;