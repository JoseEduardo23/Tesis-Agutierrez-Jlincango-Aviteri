import { Router } from "express";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { listarMascotas, registrarMascota } from "../controllers/mascota_controler.js";

const router = Router()

router.post("/mascota/registro", verificarAutenticacion, registrarMascota)

router.get("/mascota/listar", verificarAutenticacion, listarMascotas)


export default router