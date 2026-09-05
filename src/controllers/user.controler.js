import {
  UserModel,
  ProfileModel,
  ArticleModel
} from "../models/index.js";

import {
  hashPassword
} from "../helpers/bcrypt.helper.js";


// ==========================================
// GET TODOS LOS USUARIOS
// ==========================================

export const getAllUsers = async (req, res) => {
  try {

    const users = await UserModel.findAll({
      attributes: {
        exclude: ["password"]
      },

      include: {
        model: ProfileModel,
        as: "profile"
      }
    });


    return res.status(200).json(users);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message
    });

  }
};


// ==========================================
// GET USUARIO POR ID
// ==========================================

export const getUserById = async (req, res) => {
  try {

    const { id } = req.params;


    const user = await UserModel.findByPk(id, {

      attributes: {
        exclude: ["password"]
      },

      include: [
        {
          model: ProfileModel,
          as: "profile"
        },

        {
          model: ArticleModel,
          as: "articles"
        }
      ]
    });


    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }


    return res.status(200).json(user);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message
    });

  }
};


// ==========================================
// CREAR USUARIO
// ==========================================

export const createUser = async (req, res) => {
  try {

    const {
      username,
      email,
      password,
      role,
      first_name,
      last_name
    } = req.body;


    // Verificar username
    const existingUsername = await UserModel.findOne({
      where: { username }
    });


    if (existingUsername) {
      return res.status(400).json({
        message: "El username ya existe"
      });
    }


    // Verificar email
    const existingEmail = await UserModel.findOne({
      where: { email }
    });


    if (existingEmail) {
      return res.status(400).json({
        message: "El email ya existe"
      });
    }


    // Hashear password
    const hashedPassword = await hashPassword(password);


    // Crear usuario
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role
    });


    // Crear perfil
    await ProfileModel.create({
      user_id: user.id,
      first_name,
      last_name
    });


    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al crear usuario",
      error: error.message
    });

  }
};


// ==========================================
// ACTUALIZAR USUARIO
// ==========================================

export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      username,
      email,
      password,
      role
    } = req.body;


    const user = await UserModel.findByPk(id);


    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }


    // Verificar username
    if (
      username &&
      username !== user.username
    ) {

      const existingUsername = await UserModel.findOne({
        where: { username }
      });


      if (existingUsername) {
        return res.status(400).json({
          message: "El username ya existe"
        });
      }
    }


    // Verificar email
    if (
      email &&
      email !== user.email
    ) {

      const existingEmail = await UserModel.findOne({
        where: { email }
      });


      if (existingEmail) {
        return res.status(400).json({
          message: "El email ya existe"
        });
      }
    }


    const data = {
      username,
      email,
      role
    };


    // Si mandaron password, la hasheamos
    if (password) {
      data.password = await hashPassword(password);
    }


    await user.update(data);


    return res.status(200).json({
      message: "Usuario actualizado correctamente"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message
    });

  }
};


// ==========================================
// ELIMINAR USUARIO
// ==========================================

export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;


    const user = await UserModel.findByPk(id);


    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }


    await user.destroy();


    return res.status(200).json({
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message
    });

  }
};