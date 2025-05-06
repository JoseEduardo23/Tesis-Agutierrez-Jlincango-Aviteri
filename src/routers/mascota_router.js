import { Router } from "express";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { actualizarMascota, detalleMascota, eliminarMascota, listarMascotas, registrarMascota } from "../controllers/mascota_controler.js";
import { validacionMascota } from "../middlewares/mascotas_validations.js";
import { uploadMascotas } from "../middlewares/upload_cloudinary.js"
  
const router = Router()

router.post("/mascota/registro", verificarAutenticacion, validacionMascota, uploadMascotas.single("imagen"), registrarMascota) 

router.get("/mascota/listar", verificarAutenticacion, listarMascotas)

router.get("/mascota/listar/:id",verificarAutenticacion,detalleMascota)

router.put("/mascota/actualizar/:id", verificarAutenticacion, uploadMascotas.single("imagen"), actualizarMascota)

router.delete("/mascota/eliminar/:id", verificarAutenticacion, eliminarMascota)


export default router