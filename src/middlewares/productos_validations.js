import { check, validationResult } from 'express-validator';

export const validacionProducto = [
  check('nombre')
    .exists().withMessage('El campo "nombre" es obligatorio')
    .isString().withMessage('El campo "nombre" debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El campo "nombre" debe tener entre 3 y 100 caracteres'),

  check('descripcion')
    .optional()
    .isString().withMessage('El campo "descripcion" debe ser un texto')
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres'),

  check('precio')
    .exists().withMessage('El campo "precio" es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un valor positivo'),

  check('stock')
    .exists().withMessage('El campo "stock" es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número positivo'),

  check('categoria')
    .exists().withMessage('El campo "categoria" es obligatorio')
    .isString().withMessage('El campo "categoria" debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El campo "categoria" debe tener entre 3 y 50 caracteres'),

  // Middleware para manejar los errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
