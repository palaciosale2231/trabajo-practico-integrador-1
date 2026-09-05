import {
  TagModel,
  ArticleModel
} from "../models/index.js";


// ==========================================
// CREAR TAG
// ==========================================

export const createTag = async (req, res) => {
  try {

    const { name } = req.body;


    const existingTag = await TagModel.findOne({
      where: { name }
    });


    if (existingTag) {
      return res.status(400).json({
        message: "La etiqueta ya existe"
      });
    }


    const tag = await TagModel.create({
      name
    });


    return res.status(201).json({
      message: "Etiqueta creada correctamente",
      tag
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al crear etiqueta",
      error: error.message
    });

  }
};


// ==========================================
// LISTAR TAGS
// ==========================================

export const getAllTags = async (req, res) => {
  try {

    const tags = await TagModel.findAll();


    return res.status(200).json(tags);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener etiquetas",
      error: error.message
    });

  }
};


// ==========================================
// OBTENER TAG POR ID
// ==========================================

export const getTagById = async (req, res) => {
  try {

    const { id } = req.params;


    const tag = await TagModel.findByPk(id, {

      include: {
        model: ArticleModel,
        as: "articles"
      }

    });


    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada"
      });
    }


    return res.status(200).json(tag);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener etiqueta",
      error: error.message
    });

  }
};


// ==========================================
// ACTUALIZAR TAG
// ==========================================

export const updateTag = async (req, res) => {
  try {

    const { id } = req.params;

    const { name } = req.body;


    const tag = await TagModel.findByPk(id);


    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada"
      });
    }


    const existingTag = await TagModel.findOne({
      where: { name }
    });


    if (
      existingTag &&
      existingTag.id !== tag.id
    ) {

      return res.status(400).json({
        message: "La etiqueta ya existe"
      });

    }


    await tag.update({
      name
    });


    return res.status(200).json({
      message: "Etiqueta actualizada correctamente",
      tag
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al actualizar etiqueta",
      error: error.message
    });

  }
};


// ==========================================
// ELIMINAR TAG
// ==========================================

export const deleteTag = async (req, res) => {
  try {

    const { id } = req.params;


    const tag = await TagModel.findByPk(id);


    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada"
      });
    }


    await tag.destroy();


    return res.status(200).json({
      message: "Etiqueta eliminada correctamente"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al eliminar etiqueta",
      error: error.message
    });

  }
};