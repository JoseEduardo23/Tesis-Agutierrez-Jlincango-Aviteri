import { Router } from "express";
import {crearProducto,listarProductos,obtenerProductoPorId,actualizarProducto,eliminarProducto,} from "../controllers/product_controller.js";
import { verificarAutenticacion } from "../helpers/crearJWT.js";

const router = Router();

router.post("/", verificarAutenticacion, crearProducto);
router.get("/", verificarAutenticacion, listarProductos);
router.get("/:id", verificarAutenticacion, obtenerProductoPorId);
router.put("/:id", verificarAutenticacion, actualizarProducto);
router.delete("/:id", verificarAutenticacion, eliminarProducto);

export default router;
