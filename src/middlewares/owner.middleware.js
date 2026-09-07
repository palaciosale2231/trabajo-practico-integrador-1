import Article from '../models/Article.js';

export const ownerMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado.' });
    }

    // Permitir si es autor o admin
    if (article.user_id === req.user.id || req.user.role === 'admin') {
      req.article = article; // Guarda la instancia para evitar re-consultar en el controlador
      return next();
    }

    return res.status(403).json({ message: 'Acceso denegado: No eres el autor de este recurso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en la verificación de autoría.', error: error.message });
  }
};