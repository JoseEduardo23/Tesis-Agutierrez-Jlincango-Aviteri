import { check, validationResult } from 'express-validator';

export const validacionMascota = [
  check("nombre")
    .exists().withMessage('El campo "nombre" es obligatorio')
    .isString().withMessage('El campo "nombre" debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El campo "nombre" debe tener entre 3 y 50 caracteres'),

  check("raza")
    .exists().withMessage('El campo "raza" es obligatorio')
    .isString().withMessage('El campo "raza" debe ser un texto')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El campo "raza" debe tener entre 3 y 50 caracteres'),

  check("edad")
    .exists().withMessage('El campo "edad" es obligatorio')
    .isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),

  check("actividad")
    .exists().withMessage('El campo "actividad" es obligatorio')
    .isIn(['Mucha', 'Normal', 'Regular', 'Baja', 'Nula']).withMessage('El campo "actividad" debe ser uno de los siguientes: "Mucha", "Normal", "Regular", "Baja", "Nula"'),

  check("peso")
    .exists().withMessage('El campo "peso" es obligatorio')
    .isFloat({ min: 0 }).withMessage('El peso debe ser un número positivo'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
