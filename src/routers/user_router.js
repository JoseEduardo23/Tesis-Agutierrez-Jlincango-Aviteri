import {Router} from 'express'
import { comprobarTokenPasword, confirmEmail, login, nuevoPassword, recuperarPassword, registro,actualizarPassword, actualizarPerfil} from '../controllers/user_controler.js'
const router = Router()

router.post("/registro", registro)
router.post("/login", login)
router.get("/confirmar/:token", confirmEmail)
router.post("/recuperar-password/", recuperarPassword)
router.get("/recuperar-password/:token", comprobarTokenPasword)
router.post("/nuevo-password/:token", nuevoPassword)
router.put("/actualizar-password", actualizarPassword);
router.put('/perfil/:id', actualizarPerfil);


export default router