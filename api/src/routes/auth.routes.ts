import express from 'express';
import { Signup, Signin, Logout } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/logout',Logout);

export default router;
