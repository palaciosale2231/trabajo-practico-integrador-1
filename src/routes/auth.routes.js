import { Router } from 'express';
import { register, login, logout, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { registerValidation, loginValidation } from '../middlewares/validators/auth.validator.js';
import { validateResult } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/register', registerValidation, validateResult, register);
router.post('/login', loginValidation, validateResult, login);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;