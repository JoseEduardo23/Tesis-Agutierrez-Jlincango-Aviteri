import { check, validationResult } from 'express-validator'

export const validacionUsers = [
    check("nombre")
        .exists().withMessage('El campo "nombre" es obligatorio')
        .notEmpty().withMessage('El campo "nombre" no puede estar vacío')
        .isLength({ min: 3, max: 12 }).withMessage('El campo "nombre" debe tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' }).withMessage('El campo "nombre" debe contener solo letras')
        .customSanitizer(value => value?.trim()),

    check("apellido")
        .exists().withMessage('El campo "apellido" es obligatorio')
        .notEmpty().withMessage('El campo "apellido" no puede estar vacío')
        .isLength({ min: 3, max: 12 }).withMessage('El campo "apellido" debe tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' }).withMessage('El campo "apellido" debe contener solo letras')
        .customSanitizer(value => value?.trim()),

    check("direccion")
        .exists().withMessage('El campo "dirección" es obligatorio')
        .notEmpty().withMessage('El campo "dirección" no puede estar vacío')
        .isLength({ min: 3, max: 20 }).withMessage('El campo "dirección" debe tener entre 3 y 20 caracteres')
        .customSanitizer(value => value?.trim()),

    check("telefono")
        .exists().withMessage('El campo "teléfono" es obligatorio')
        .isLength({ min: 10, max: 10 }).withMessage('El campo "teléfono" debe tener exactamente 10 dígitos')
        .isNumeric().withMessage('El campo "teléfono" debe contener solo números')
        .customSanitizer(value => value?.trim()),

    check("email")
        .exists().withMessage('El campo "email" es obligatorio')
        .isEmail().withMessage('El campo "email" no es válido')
        .customSanitizer(value => value?.trim()),

    check("password")
        .exists().withMessage('El campo "password" es obligatorio')
        .isLength({ min: 8, max:20 }).withMessage('El campo "password" debe tener entre 8 y 20 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/).withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un caracter especial')
        .customSanitizer(value => value?.trim()),


    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).json({ errors: errors.array() });
        }
    }
];
