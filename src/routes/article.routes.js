import { Router } from 'express';
import { 
  createArticle, getArticles, getArticleById, 
  getUserArticles, getUserArticleById, updateArticle, deleteArticle 
} from '../controllers/article.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ownerMiddleware } from '../middlewares/owner.middleware.js';
import { articleValidation, idParamValidation } from '../middlewares/validators/article.validator.js';
import { validateResult } from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authMiddleware); // Todas las rutas requieren estar logueado

router.post('/', articleValidation, validateResult, createArticle);
router.get('/', getArticles);
router.get('/user', getUserArticles);
router.get('/user/:id', idParamValidation, validateResult, getUserArticleById);
router.get('/:id', idParamValidation, validateResult, getArticleById);

// Editar / Eliminar requieren ser autor o admin
router.put('/:id', idParamValidation, ownerMiddleware, articleValidation, validateResult, updateArticle);
router.delete('/:id', idParamValidation, ownerMiddleware, validateResult, deleteArticle);

export default router;