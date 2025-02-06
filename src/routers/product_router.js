import { Router } from "express";
import {crearProducto,listarProductos,obtenerProductoPorId,actualizarProducto,eliminarProducto,} from "../controllers/product_controller.js";
import { verificarAutenticacion } from "../helpers/crearJWT.js";

const router = Router();

router.post("/crear/producto", verificarAutenticacion, crearProducto);
router.get("/listar/productos", listarProductos);
router.get("/detalle/producto/:id", verificarAutenticacion, obtenerProductoPorId);
router.put("/actualizar/producto/:id", verificarAutenticacion, actualizarProducto);
router.delete("/eliminar/producto/:id", verificarAutenticacion, eliminarProducto);

export default router;
