import {
  UserModel,
  ProfileModel
} from "../models/index.js";

import {
  hashPassword,
  comparePassword
} from "../helpers/bcrypt.helper.js";

import {
  generateToken
} from "../helpers/jwt.helper.js";


// ==========================================
// REGISTRO
// ==========================================

export const register = async (req, res) => {
  try {

    const {
      username,
      email,
      password,
      first_name,
      last_name,
      biography,
      avatar_url,
      birth_date
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


    // Hashear contraseña
    const hashedPassword = await hashPassword(password);


    // Crear usuario
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: "user"
    });


    // Crear perfil automáticamente
    await ProfileModel.create({
      user_id: user.id,
      first_name,
      last_name,
      biography,
      avatar_url,
      birth_date
    });


    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message
    });

  }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;


    // Buscar usuario
    const user = await UserModel.findOne({
      where: { email }
    });


    if (!user) {
      return res.status(401).json({
        message: "Email o contraseña incorrectos"
      });
    }


    // Comparar contraseña
    const passwordCorrect = await comparePassword(
      password,
      user.password
    );


    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email o contraseña incorrectos"
      });
    }


    // Generar JWT
    const token = generateToken({
      id: user.id,
      role: user.role
    });


    // Guardar JWT en cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });


    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message
    });

  }
};


// ==========================================
// OBTENER PERFIL
// ==========================================

export const getProfile = async (req, res) => {
  try {

    const user = await UserModel.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"]
      },

      include: {
        model: ProfileModel,
        as: "profile"
      }
    });


    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }


    return res.status(200).json(user);

  } catch (error) {

    return res.status(500).json({
      message: "Error al obtener perfil",
      error: error.message
    });

  }
};


// ==========================================
// ACTUALIZAR PERFIL
// ==========================================

export const updateProfile = async (req, res) => {
  try {

    const {
      first_name,
      last_name,
      biography,
      avatar_url,
      birth_date
    } = req.body;


    const profile = await ProfileModel.findOne({
      where: {
        user_id: req.user.id
      }
    });


    if (!profile) {
      return res.status(404).json({
        message: "Perfil no encontrado"
      });
    }


    await profile.update({
      first_name,
      last_name,
      biography,
      avatar_url,
      birth_date
    });


    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      profile
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al actualizar perfil",
      error: error.message
    });

  }
};


// ==========================================
// LOGOUT
// ==========================================

export const logout = async (req, res) => {
  try {

    res.clearCookie("token");

    return res.status(200).json({
      message: "Sesión cerrada correctamente"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Error al cerrar sesión",
      error: error.message
    });

  }
};