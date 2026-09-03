import { UserModel } from "../models/user.model.js";

// 1. CREAR
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "El email ya existe" });

    const user = await UserModel.create({ name, email, password });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};

// 2. OBTENER TODOS
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};

// 3. OBTENER POR ID
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};

// 4. ACTUALIZAR
export const updateUser = async (req, res) => {
  try {
    const [updatedRows] = await UserModel.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};

// 5. ELIMINAR
export const deleteUser = async (req, res) => {
  try {
    const deletedRows = await UserModel.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};
