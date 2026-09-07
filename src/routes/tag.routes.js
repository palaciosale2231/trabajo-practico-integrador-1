import { Router } from 'express';
import { createTag, getTags, getTagById, updateTag, deleteTag } from '../controllers/tag.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { tagValidation } from '../middlewares/validators/tag.validator.js';
import { idParamValidation } from '../middlewares/validators/article.validator.js';
import { validateResult } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authMiddleware); // Usuario autenticado como base

router.get('/', getTags); // Usuario autenticado

// Rutas de Solo Admin
router.get('/:id', adminMiddleware, idParamValidation, validateResult, getTagById);
router.post('/', adminMiddleware, tagValidation, validateResult, createTag);
router.put('/:id', adminMiddleware, idParamValidation, tagValidation, validateResult, updateTag);
router.delete('/:id', adminMiddleware, idParamValidation, validateResult, deleteTag);

export default router;