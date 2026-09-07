import { body, param } from 'express-validator';

export const articleValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio.')
    .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres.'),
  body('content')
    .trim()
    .notEmpty().withMessage('El contenido es obligatorio.')
    .isLength({ min: 50 }).withMessage('El contenido debe tener al menos 50 caracteres.'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 }).withMessage('El resumen no puede superar los 500 caracteres.'),
  body('status')
    .optional()
    .isIn(['published', 'archived']).withMessage('Estado inválido.'),
];

export const idParamValidation = [
  param('id').isInt().withMessage('El ID debe ser un número entero válido.'),
];