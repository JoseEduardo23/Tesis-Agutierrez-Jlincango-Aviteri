import { Router } from 'express';
import { verificarAutenticacion } from '../helpers/crearJWT.js';
import { registro, login, confirmEmail, recuperarPassword, comprobarTokenPasword, nuevoPassword, perfilUsuario, actualizarPassword, actualizarPerfil } from '../controllers/usuario_controller.js';

const router = Router();

router.post('/usuario/registro', registro);
router.post('/usuario/login', login);
router.get('/usuario/confirmar/:token', confirmEmail);

router.post('/usuario/recuperar-password', recuperarPassword);
router.get('/usuario/recuperar-password/:token', comprobarTokenPasword);
router.post('/usuario/recuperar-password/:token', nuevoPassword);

router.get('/usuario/perfil', verificarAutenticacion, perfilUsuario);
router.put('/usuario/actualizar-perfil/:id', verificarAutenticacion, actualizarPerfil);
router.put('/usuario/actualizar-password/:id', verificarAutenticacion, actualizarPassword);

export default router;
