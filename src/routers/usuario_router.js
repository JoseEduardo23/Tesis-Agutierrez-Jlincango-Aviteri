import { Router } from 'express';
import { verificarAutenticacion } from '../helpers/crearJWT.js';
import { registro, login, confirmEmail, recuperarPassword, comprobarTokenPasword, nuevoPassword, perfilUsuario, actualizarPassword, actualizarPerfil, listarUsuarios, eliminarUsuario } from '../controllers/usuario_controller.js';
import { validacionUsers } from '../middlewares/users_validations.js';
const router = Router();

router.post('/usuario/registro', validacionUsers, registro); //🖇 
router.post('/usuario/login', login);//🖇 
router.post('/usuario/recuperar-password', recuperarPassword);//
router.get('/usuario/recuperar-password/:token', comprobarTokenPasword); //🖇
router.post('/usuario/nuevo-password/:token', nuevoPassword);
router.get('/usuario/confirmar/:token', confirmEmail);//🖇 

router.get("/usuarios", verificarAutenticacion, listarUsuarios)//🖇 
router.get('/usuario/perfil', verificarAutenticacion, perfilUsuario); //🖇 
router.put('/usuario/actualizar-perfil/:id', validacionUsers, verificarAutenticacion, actualizarPerfil); //🖇
router.delete("/usuario/eliminar/:id", verificarAutenticacion, eliminarUsuario) //🖇 
router.put('/usuario/actualizar-password/:id', verificarAutenticacion, actualizarPassword);//

export default router;
