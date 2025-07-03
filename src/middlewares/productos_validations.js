import { check, validationResult } from 'express-validator';

export const validacionProducto = [
  check('nombre')
    .exists().withMessage('El campo "nombre" es obligatorio')
    .isString().withMessage('El campo "nombre" debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('El campo "nombre" debe tener entre 3 y 30 caracteres'),

  check('descripcion')
    .optional()
    .isString().withMessage('El campo "descripcion" debe ser un texto')
    .trim()
    .isLength({ max: 100 }).withMessage('La descripción no puede tener más de 100 caracteres'),

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
    .isIn(['Perros', 'Gatos', 'Peces', 'Aves','Otros']).withMessage('El campo "categoria" debe ser uno de: perros, gatos, peces, aves'),
  check("enfermedad")
    .optional()
    .isString().withMessage('El campo "enfermedad" debe ser un texto')
    .trim()
    .isLength({ max: 40 }).withMessage('La enfermedad no puede tener más de 50 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
