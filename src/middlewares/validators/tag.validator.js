import { body } from 'express-validator';
import Tag from '../../models/Tag.js';

export const tagValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre de la etiqueta es obligatorio.')
    .isLength({ min: 2, max: 30 }).withMessage('Debe tener entre 2 y 30 caracteres.')
    .custom((value) => !/\s/.test(value)).withMessage('El nombre no debe contener espacios.')
    .custom(async (value) => {
      const tag = await Tag.findOne({ where: { name: value } });
      if (tag) throw new Error('La etiqueta ya existe.');
    }),
];