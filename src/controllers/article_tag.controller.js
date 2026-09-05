import {
  ArticleModel,
  TagModel,
  ArticleTagModel
} from "../models/index.js";


// ==========================================
// AGREGAR TAG A ARTÍCULO
// ==========================================

export const addTagToArticle = async (req, res) => {
  try {

    const {
      article_id,
      tag_id
    } = req.body;


    // Buscar artículo
    const article = await ArticleModel.findByPk(
      article_id
    );


    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }


    // Verificar que sea el autor
    if (
      article.user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message: "No eres el autor del artículo"
      });

    }


    // Buscar tag
    const tag = await TagModel.findByPk(
      tag_id
    );


    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada"
      });
    }


    // Verificar si ya existe la relación
    const existingRelation =
      await ArticleTagModel.findOne({

        where: {
          article_id,
          tag_id
        }

      });


    if (existingRelation) {
      return res.status(400).json({
        message: "La etiqueta ya está asociada al artículo"
      });
    }


    // Crear relación
    const relation =
      await ArticleTagModel.create({

        article_id,
        tag_id

      });


    return res.status(201).json({
      message: "Etiqueta agregada al artículo",
      relation
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al agregar etiqueta",
      error: error.message
    });

  }
};


// ==========================================
// REMOVER TAG
// ==========================================

export const removeTagFromArticle = async (req, res) => {
  try {

    const {
      articleTagId
    } = req.params;


    // Buscar relación
    const relation =
      await ArticleTagModel.findByPk(
        articleTagId
      );


    if (!relation) {
      return res.status(404).json({
        message: "Relación no encontrada"
      });
    }


    // Buscar artículo
    const article =
      await ArticleModel.findByPk(
        relation.article_id
      );


    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }


    // Verificar autor
    if (
      article.user_id !== req.user.id &&
      req.user.role !== "admin"
    ) {

      return res.status(403).json({
        message: "No eres el autor del artículo"
      });

    }


    // Eliminar relación
    await relation.destroy();


    return res.status(200).json({
      message: "Etiqueta removida del artículo"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al remover etiqueta",
      error: error.message
    });

  }
};