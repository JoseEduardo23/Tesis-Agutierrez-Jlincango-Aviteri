import { Router } from "express";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { actualizarMascota, detalleMascota, eliminarMascota, listarMascotas, registrarMascota, generarDieta } from "../controllers/mascota_controler.js";
import { validacionMascota } from "../middlewares/mascotas_validations.js";
import { uploadMascotas } from "../middlewares/upload_cloudinary.js"
  
const router = Router()

router.post("/mascota/registro", verificarAutenticacion, uploadMascotas.single("imagen"), validacionMascota, registrarMascota) 

router.get("/mascota/listar", verificarAutenticacion, listarMascotas)

router.get("/mascota/listar/:id",verificarAutenticacion,detalleMascota)

router.put("/mascota/actualizar/:id", verificarAutenticacion, uploadMascotas.single("imagen"), validacionMascota, actualizarMascota)

router.delete("/mascota/eliminar/:id", verificarAutenticacion, eliminarMascota)

router.post("/mascota/generar-dieta/:id", verificarAutenticacion, generarDieta)

export default router