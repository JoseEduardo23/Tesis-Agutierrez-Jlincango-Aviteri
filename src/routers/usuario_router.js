import {Router} from 'express';
import { verificarAutenticacion } from '../helpers/crearJWT.js';
import { actualizarUsuario, detalleUsuario, eliminarUsuario, listarUsuarios, registrarUsuario } from '../controllers/usuario_controller.js';

const router = Router()

router.post('/usuario/registro', registrarUsuario)
router.get('/usuarios', listarUsuarios)
router.get('/usuario-detalle/:id',  detalleUsuario)
router.put('/usuario-actualizar/:id', actualizarUsuario)
router.delete('/usuario-eliminar/:id',  eliminarUsuario)

export default router
