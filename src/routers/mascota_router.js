import { Router } from "express";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { actualizarMascota, detalleMascota, eliminarMascota, listarMascotas, registrarMascota } from "../controllers/mascota_controler.js";

const router = Router()

router.post("/mascota/registro", verificarAutenticacion, registrarMascota)

router.get("/mascota/listar", verificarAutenticacion, listarMascotas)

router.get("/mascota/listar/:id",verificarAutenticacion,detalleMascota)

router.put("/mascota/actualizar/:id", verificarAutenticacion, actualizarMascota)

router.delete("/mascota/eliminar/:id", verificarAutenticacion, eliminarMascota)


export default router