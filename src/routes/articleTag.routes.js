import { Router } from 'express';
import { addTagToArticle, removeTagFromArticle } from '../controllers/articleTag.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', addTagToArticle); // En el controlador validar que el req.user.id sea autor
router.delete('/:articleTagId', removeTagFromArticle);

export default router;