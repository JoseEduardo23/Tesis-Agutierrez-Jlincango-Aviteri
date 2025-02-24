import {Router} from 'express'
import { comprobarTokenPasword, confirmEmail, login, nuevoPassword, recuperarPassword, registro,actualizarPassword, actualizarPerfil, perfilAdministrador} from '../controllers/admin_controler.js'
import { verificarAutenticacion } from '../helpers/crearJWT.js'
import { validacionUsers } from '../middlewares/users_validations.js'

const router = Router()

//Endpoint para el registro
router.post("/register", validacionUsers, registro)

//Endpoint para confirmar el regitro
router.get("/confirmar/:token", confirmEmail)

//Endpoint para el inicio de sesion
router.post("/login", login)

//Endpoint para restablecer la contraseña
router.post("/recuperar-password/", recuperarPassword)

//Endpoint para comprobar el token de recuperar contraseña
router.get("/recuperar-password/:token", comprobarTokenPasword)

//Endpoint para crear una nueva contraseña
router.post("/nuevo-password/:token", nuevoPassword)



//Endpoint para ver el perfil del usuario
router.get('/perfil',verificarAutenticacion, perfilAdministrador)

//Endpoint para actualizar el perfil del usuario
router.put('/perfil/:id',verificarAutenticacion, actualizarPerfil);

//Endpoint para actualizar la contraseña del usuario
router.put("/actualizar-password",verificarAutenticacion, actualizarPassword);


export default router