import { body } from 'express-validator';
import User from '../../models/User.js';

export const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('El username es obligatorio.')
    .isLength({ min: 3, max: 20 }).withMessage('El username debe tener entre 3 y 20 caracteres.')
    .isAlphanumeric().withMessage('El username solo debe contener letras y números.')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) throw new Error('El username ya está en uso.');
    }),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Debe ingresar un email válido.')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) throw new Error('El email ya está registrado.');
    }),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/[a-z]/).withMessage('La contraseña debe incluir al menos una letra minúscula.')
    .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula.')
    .matches(/[0-9]/).withMessage('La contraseña debe incluir al menos un número.'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Debe ingresar un email válido.'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
];