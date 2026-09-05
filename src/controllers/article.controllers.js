import {
  ArticleModel,
  UserModel,
  TagModel
} from "../models/index.js";


// ==========================================
// CREAR ARTÍCULO
// ==========================================

export const createArticle = async (req, res) => {
  try {

    const {
      title,
      content,
      excerpt,
      status
    } = req.body;


    const article = await ArticleModel.create({

      title,

      content,

      excerpt,

      status: status || "published",

      // Usuario autenticado
      user_id: req.user.id
    });


    return res.status(201).json({
      message: "Artículo creado correctamente",
      article
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al crear artículo",
      error: error.message
    });

  }
};


// ==========================================
// LISTAR ARTÍCULOS PUBLICADOS
// ==========================================

export const getAllArticles = async (req, res) => {
  try {

    const articles = await ArticleModel.findAll({

      where: {
        status: "published"
      },

      include: [

        {
          model: UserModel,
          as: "author",

          attributes: [
            "id",
            "username"
          ]
        },

        {
          model: TagModel,
          as: "tags"
        }

      ]
    });


    return res.status(200).json(articles);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener artículos",
      error: error.message
    });

  }
};


// ==========================================
// OBTENER ARTÍCULO POR ID
// ==========================================

export const getArticleById = async (req, res) => {
  try {

    const { id } = req.params;


    const article = await ArticleModel.findByPk(id, {

      include: [

        {
          model: UserModel,
          as: "author",

          attributes: [
            "id",
            "username"
          ]
        },

        {
          model: TagModel,
          as: "tags"
        }

      ]
    });


    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }


    return res.status(200).json(article);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener artículo",
      error: error.message
    });

  }
};


// ==========================================
// LISTAR MIS ARTÍCULOS
// ==========================================

export const getMyArticles = async (req, res) => {
  try {

    const articles = await ArticleModel.findAll({

      where: {
        user_id: req.user.id,
        status: "published"
      },

      include: {
        model: TagModel,
        as: "tags"
      }
    });


    return res.status(200).json(articles);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener tus artículos",
      error: error.message
    });

  }
};


// ==========================================
// OBTENER MI ARTÍCULO POR ID
// ==========================================

export const getMyArticleById = async (req, res) => {
  try {

    const { id } = req.params;


    const article = await ArticleModel.findOne({

      where: {
        id,
        user_id: req.user.id
      },

      include: {
        model: TagModel,
        as: "tags"
      }
    });


    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }


    return res.status(200).json(article);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener artículo",
      error: error.message
    });

  }
};


// ==========================================
// ACTUALIZAR ARTÍCULO
// ==========================================

export const updateArticle = async (req, res) => {
  try {

    const { id } = req.params;


    const article = await ArticleModel.findByPk(id);


    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }


    // Verificar propietario
    if (
      article.user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message: "No tienes permiso para editar este artículo"
      });

    }


    const {
      title,
      content,
      excerpt,
      status
    } = req.body;


    await article.update({

      title,

      content,

      excerpt,

      status

    });


    return res.status(200).json({
      message: "Artículo actualizado correctamente",
      article
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al actualizar artículo",
      error: error.message
    });

  }
};


// ==========================================
// ELIMINAR ARTÍCULO
// ==========================================

export const deleteArticle = async (req, res) => {
  try {

    const { id } = req.params;


    const article = await ArticleModel.findByPk(id);


    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }


    // Verificar propietario
    if (
      article.user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message: "No tienes permiso para eliminar este artículo"
      });

    }


    await article.destroy();


    return res.status(200).json({
      message: "Artículo eliminado correctamente"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al eliminar artículo",
      error: error.message
    });

  }
};